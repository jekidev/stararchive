# Agent notes

This repository is the portable GitHub star archive for `jekidev`.

## Before answering star questions

1. Read `genres/INDEX.md`
2. Open the matching `genres/<genre>.md` file
3. Use `catalog/catalog.json` when you need structured fields
4. Do not invent starred repositories from memory

## Paths

- Catalog: `catalog/catalog.json`
- CSV: `catalog/starred_repos.csv`
- Genre map: `catalog/genres.json`
- Skill: `.cursor/skills/github-starred-repos/SKILL.md`
- Upstream STARCHIVE: `vendor/starchive/`

## Refresh

```bash
GITHUB_USERNAME=jekidev node scripts/refresh.mjs
node scripts/classify.mjs
```

A token is only required for private or hidden stars. Never commit tokens.
