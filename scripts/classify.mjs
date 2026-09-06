#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { allGenreDefs, classifyRepo } from './lib/genres.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const catalogPath = join(root, 'catalog', 'catalog.json')
const genresDir = join(root, 'genres')

function requireCatalog(payload) {
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.repos)) {
    throw new Error('catalog.json must include a repos array')
  }
  return payload
}

function markdownRow(repo) {
  const language = repo.language || 'Unknown'
  const description = String(repo.description || '').replace(/\|/g, '\\|').replace(/\n/g, ' ')
  return `| [${repo.fullName}](${repo.htmlUrl}) | ${language} | ${repo.stars} | ${description} |`
}

function writeGenreFile(genre, repos) {
  const lines = [
    `# ${genre.title}`,
    '',
    `${repos.length} starred repositories in this genre. A repo can appear in more than one genre.`,
    '',
    '| Repository | Language | Stars | Description |',
    '| --- | --- | ---: | --- |',
    ...repos.map(markdownRow),
    '',
  ]
  writeFileSync(join(genresDir, `${genre.id}.md`), lines.join('\n'), 'utf8')
}

const catalog = requireCatalog(JSON.parse(readFileSync(catalogPath, 'utf8')))
mkdirSync(genresDir, { recursive: true })

const buckets = new Map(allGenreDefs().map((genre) => [genre.id, []]))
const assignments = []

for (const repo of catalog.repos) {
  const ids = classifyRepo(repo)
  assignments.push({ fullName: repo.fullName, genres: ids })
  for (const id of ids) {
    const bucket = buckets.get(id)
    if (bucket) bucket.push(repo)
  }
}

for (const genre of allGenreDefs()) {
  const repos = buckets.get(genre.id) ?? []
  repos.sort((a, b) => b.stars - a.stars || a.fullName.localeCompare(b.fullName))
  writeGenreFile(genre, repos)
}

const indexLines = [
  '# Genres',
  '',
  `Classified ${catalog.repos.length} starred repositories for \`${catalog.username}\` (${catalog.exportedAt ?? 'unknown export time'}).`,
  '',
  '| Genre | Count | File |',
  '| --- | ---: | --- |',
  ...allGenreDefs().map((genre) => {
    const count = (buckets.get(genre.id) ?? []).length
    return `| ${genre.title} | ${count} | [${genre.id}.md](./${genre.id}.md) |`
  }),
  '',
  'Language genres are extra tags. Topic genres are the primary grouping. `other` is only used when no topic genre matches.',
  '',
]
writeFileSync(join(genresDir, 'INDEX.md'), indexLines.join('\n'), 'utf8')
writeFileSync(join(root, 'catalog', 'genres.json'), `${JSON.stringify({
  username: catalog.username,
  exportedAt: catalog.exportedAt,
  classifiedAt: new Date().toISOString(),
  assignments,
}, null, 2)}\n`, 'utf8')

for (const genre of allGenreDefs()) {
  const count = (buckets.get(genre.id) ?? []).length
  console.log(`${genre.id}\t${count}`)
}
