# stararchive

Portable archive of [jekidev](https://github.com/jekidev)'s GitHub starred repositories.

This repo exists so the same star catalog can be used from Cursor, other IDEs, and agents. It includes:

- the full starred list in `catalog/`
- the same repos grouped by genre in `genres/`
- a vendored copy of [jwardsmith/STARCHIVE](https://github.com/jwardsmith/STARCHIVE)
- a Cursor skill named **GitHub starred repos**

Live snapshot: **1219** public stars (exported 2026-09-06).

## Layout

```
catalog/catalog.json          structured snapshot
catalog/starred_repos.csv     STARCHIVE-compatible CSV
catalog/genres.json           repo -> genre assignments
genres/INDEX.md               genre counts
genres/<genre>.md             one markdown list per genre
vendor/starchive/             upstream STARCHIVE scripts
scripts/refresh.mjs           fetch stars from GitHub
scripts/classify.mjs          rebuild genre files
.cursor/skills/github-starred-repos/SKILL.md
```

## Genres

Topic genres are the primary grouping. Language genres are extra tags. A repo can appear in more than one file.

| Genre | File |
| --- | --- |
| Awesome lists | [genres/awesome-lists.md](genres/awesome-lists.md) |
| AI agents | [genres/ai-agents.md](genres/ai-agents.md) |
| LLM and models | [genres/llm-models.md](genres/llm-models.md) |
| Biohacking and health | [genres/biohacking-health.md](genres/biohacking-health.md) |
| Security | [genres/security.md](genres/security.md) |
| OSINT and Telegram | [genres/osint-telegram.md](genres/osint-telegram.md) |
| Mobile and Android | [genres/mobile-android.md](genres/mobile-android.md) |
| DevOps and self-hosted | [genres/devops-selfhosted.md](genres/devops-selfhosted.md) |
| Data and ML | [genres/data-ml.md](genres/data-ml.md) |
| Web frontend | [genres/web-frontend.md](genres/web-frontend.md) |
| CLIs and IDEs | [genres/cli-ides.md](genres/cli-ides.md) |
| Learning | [genres/learning.md](genres/learning.md) |
| Python | [genres/python.md](genres/python.md) |
| TypeScript and JavaScript | [genres/typescript-javascript.md](genres/typescript-javascript.md) |
| Systems (Rust, Go, C/C++) | [genres/systems-rust-go-cpp.md](genres/systems-rust-go-cpp.md) |
| Other | [genres/other.md](genres/other.md) |

Start at [genres/INDEX.md](genres/INDEX.md) for current counts.

## Refresh

Public stars do not need a token:

```bash
node scripts/refresh.mjs
node scripts/classify.mjs
```

Private or hidden stars:

```bash
export GITHUB_USERNAME=jekidev
export GITHUB_TOKEN=ghp_...   # public_repo scope
node scripts/refresh.mjs
node scripts/classify.mjs
```

Do not put tokens in source files.

## Use in other IDEs

Clone this repository and point the agent or skill at it:

```bash
git clone https://github.com/jekidev/stararchive.git
```

Cursor: the skill is at `.cursor/skills/github-starred-repos/SKILL.md`. Copy that folder into another workspace, or install the local plugin from this repo.

## STARCHIVE

Upstream STARCHIVE is vendored in `vendor/starchive/` (PowerShell + Python). Prefer `scripts/refresh.mjs` here so credentials stay in environment variables. STARCHIVE is read-only and does not change GitHub stars.

## Related

- App integration: [jekidev/-Ubermench-Personal-Biohacking-Framework-](https://github.com/jekidev/-Ubermench-Personal-Biohacking-Framework-)
- Upstream tool: [jwardsmith/STARCHIVE](https://github.com/jwardsmith/STARCHIVE)
