---
name: github-starred-repos
description: Look up Jeppe's GitHub starred repositories by genre from the portable stararchive catalog. Use when the user asks about starred repos, STARCHIVE, GitHub stars, saved tools, or which repositories they have starred.
---

# GitHub starred repos

Read Jeppe's starred GitHub repositories from the portable archive. Do not guess from memory.

## Canonical archive

https://github.com/jekidev/stararchive

Resolve files in this order:

1. If the current workspace is `jekidev/stararchive`, read the local files.
2. If the current workspace is Ubermench, also check `app/data/starchive/catalog.json`.
3. Otherwise clone or fetch `https://github.com/jekidev/stararchive`.

## Read order

1. `genres/INDEX.md` for counts and the genre list
2. The matching `genres/<genre>.md` file or files
3. `catalog/catalog.json` for structured fields (`fullName`, `description`, `language`, `stars`, `htmlUrl`)
4. `catalog/starred_repos.csv` only when a spreadsheet dump is needed

## Genres

Topic: `awesome-lists`, `ai-agents`, `llm-models`, `biohacking-health`, `security`, `osint-telegram`, `mobile-android`, `devops-selfhosted`, `data-ml`, `web-frontend`, `cli-ides`, `learning`, `other`

Language tags: `python`, `typescript-javascript`, `systems-rust-go-cpp`

A repository can belong to more than one genre.

## Refresh

```bash
GITHUB_USERNAME=jekidev node scripts/refresh.mjs
node scripts/classify.mjs
```

`GITHUB_TOKEN` is optional for public stars. Never write tokens into source files.

## Rules

- If a repository is not in the catalog, say it is not in the starred archive.
- Prefer genre markdown for browsing and `catalog.json` for exact metadata.
- STARCHIVE upstream lives in `vendor/starchive/` and is read-only.
- Do not modify GitHub stars, lists, or other repositories unless the user explicitly asks.
