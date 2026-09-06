#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const username = (process.env.GITHUB_USERNAME || 'jekidev').trim()
const token = (process.env.GITHUB_TOKEN || '').trim()

if (!username) throw new Error('GITHUB_USERNAME is required')

function csvField(value) {
  const text = value == null ? '' : String(value)
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

function mapRepo(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Starred repository payload must be an object')
  const fullName = String(payload.full_name || '').trim()
  const htmlUrl = String(payload.html_url || '').trim()
  if (!fullName) throw new Error('Starred repository is missing full_name')
  if (!htmlUrl) throw new Error('Starred repository is missing html_url')
  return {
    fullName,
    description: typeof payload.description === 'string' ? payload.description : '',
    htmlUrl,
    language: typeof payload.language === 'string' ? payload.language : null,
    stars: Number.isFinite(payload.stargazers_count) ? payload.stargazers_count : 0,
    forks: Number.isFinite(payload.forks_count) ? payload.forks_count : 0,
    createdAt: typeof payload.created_at === 'string' ? payload.created_at : '',
    updatedAt: typeof payload.updated_at === 'string' ? payload.updated_at : '',
    listed: false,
  }
}

function nextLink(header) {
  if (!header) return null
  const match = header.match(/<([^>]+)>\s*;\s*rel="next"/i)
  return match?.[1] ?? null
}

function headers() {
  const result = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'jekidev-stararchive',
  }
  if (token) result.Authorization = `Bearer ${token}`
  return result
}

function toCsv(repos) {
  const header = 'full_name,description,html_url,language,stargazers_count,forks_count,created_at,updated_at'
  const rows = repos.map((repo) => [
    csvField(repo.fullName),
    csvField(repo.description.replace(/\n/g, ' ').replace(/\t/g, ' ')),
    csvField(repo.htmlUrl),
    csvField(repo.language),
    csvField(repo.stars),
    csvField(repo.forks),
    csvField(repo.createdAt),
    csvField(repo.updatedAt),
  ].join(','))
  return [header, ...rows].join('\n') + '\n'
}

const repos = []
let url = `https://api.github.com/users/${encodeURIComponent(username)}/starred?per_page=100`
while (url) {
  const response = await fetch(url, { headers: headers() })
  if (response.status === 401 || response.status === 403) {
    throw new Error('GitHub authentication failed. Check GITHUB_TOKEN and public_repo scope.')
  }
  if (!response.ok) throw new Error(`GitHub request failed (${response.status}) for ${url}`)
  const payload = await response.json()
  if (!Array.isArray(payload)) throw new Error('GitHub starred response must be an array')
  for (const item of payload) repos.push(mapRepo(item))
  url = nextLink(response.headers.get('link'))
}

const catalog = {
  username,
  exportedAt: new Date().toISOString(),
  repos,
  lists: [],
}

mkdirSync(join(root, 'catalog'), { recursive: true })
writeFileSync(join(root, 'catalog', 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`, 'utf8')
writeFileSync(join(root, 'catalog', 'starred_repos.csv'), toCsv(repos), 'utf8')
console.log(`Wrote ${repos.length} starred repositories for ${username}`)
