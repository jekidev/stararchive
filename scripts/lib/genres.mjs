export const TOPIC_GENRES = [
  {
    id: 'awesome-lists',
    title: 'Awesome lists',
    test: (text, fullName) =>
      /awesome[- ]|curated list|awesome list/.test(text)
      || /(^|\/)awesome[-_]/.test(fullName)
      || /\/awesome$/.test(fullName),
  },
  {
    id: 'ai-agents',
    title: 'AI agents',
    test: (text) =>
      /\b(agent|agents|agentic|mcp|langchain|langgraph|autogen|crewai|browser.?use|computer.?use|claude|codex|openclaw|multi-agent)\b/.test(text),
  },
  {
    id: 'llm-models',
    title: 'LLM and models',
    test: (text) =>
      /\b(llm|llms|gpt|llama|mistral|huggingface|ollama|whisper|stable.?diffusion|comfyui|lora|vllm|gguf|mlx|inference|tokenizer|transformer|embedding|token)\b/.test(text),
  },
  {
    id: 'biohacking-health',
    title: 'Biohacking and health',
    test: (text) =>
      /\b(biohack|longevity|circadian|wearable|whoop|oura|nutrition|supplement|biomarker|fitness|sleep|healthkit|quantified|wellness|medical|ehr|whoop)\b/.test(text),
  },
  {
    id: 'security',
    title: 'Security',
    test: (text) =>
      /\b(security|cve|pentest|owasp|exploit|malware|ransomware|phishing|forensic|vulnerability|red.?team|blue.?team|payload|bypass|attack|yara|mimikatz|cobalt|c2)\b/.test(text),
  },
  {
    id: 'osint-telegram',
    title: 'OSINT and Telegram',
    test: (text) =>
      /\b(osint|telegram|discord|signal|social.?media|scraper|scraping)\b/.test(text),
  },
  {
    id: 'mobile-android',
    title: 'Mobile and Android',
    test: (text, _fullName, language) =>
      /\b(android|termux|kotlin|flutter|ios|swift|react.?native|mobile)\b/.test(text)
      || ['Kotlin', 'Dart', 'Swift'].includes(language),
  },
  {
    id: 'devops-selfhosted',
    title: 'DevOps and self-hosted',
    test: (text) =>
      /\b(docker|kubernetes|k8s|terraform|ansible|self.?host|homelab|nginx|github.?action|helm|prometheus|grafana|ci.?cd|traefik|portainer)\b/.test(text),
  },
  {
    id: 'data-ml',
    title: 'Data and ML',
    test: (text, _fullName, language) =>
      /\b(pandas|numpy|scikit|jupyter|dataset|mlops|pytorch|tensorflow|machine.?learn|data.?scien|sklearn|notebook)\b/.test(text)
      || language === 'Jupyter Notebook',
  },
  {
    id: 'web-frontend',
    title: 'Web frontend',
    test: (text, _fullName, language) =>
      /\b(vue|react|next\.?js|nuxt|tailwind|frontend|svelte|astro)\b/.test(text)
      || language === 'Vue'
      || language === 'CSS',
  },
  {
    id: 'cli-ides',
    title: 'CLIs and IDEs',
    test: (text) =>
      /\b(cli|devtools|linter|eslint|formatter|ide|editor|vscode|neovim|cursor|windsurf|zed|helix|termux)\b/.test(text),
  },
  {
    id: 'learning',
    title: 'Learning',
    test: (text) =>
      /\b(learn|tutorial|course|guidebook|interview|cheatsheet|handbook|awesome-course)\b/.test(text),
  },
]

export const LANGUAGE_GENRES = [
  {
    id: 'python',
    title: 'Python',
    test: (_text, _fullName, language) => language === 'Python',
  },
  {
    id: 'typescript-javascript',
    title: 'TypeScript and JavaScript',
    test: (_text, _fullName, language) => language === 'TypeScript' || language === 'JavaScript',
  },
  {
    id: 'systems-rust-go-cpp',
    title: 'Systems (Rust, Go, C/C++)',
    test: (_text, _fullName, language) => ['Rust', 'Go', 'C++', 'C', 'Zig'].includes(language),
  },
]

export const OTHER_GENRE = { id: 'other', title: 'Other' }

export function classifyRepo(repo) {
  if (!repo || typeof repo !== 'object') throw new Error('repo must be an object')
  const fullName = String(repo.fullName || '').trim()
  if (!fullName) throw new Error('repo.fullName is required')
  const language = typeof repo.language === 'string' ? repo.language : ''
  const text = `${fullName} ${repo.description || ''} ${language}`.toLowerCase()
  const topics = TOPIC_GENRES.filter((genre) => genre.test(text, fullName.toLowerCase(), language)).map((genre) => genre.id)
  const languages = LANGUAGE_GENRES.filter((genre) => genre.test(text, fullName.toLowerCase(), language)).map((genre) => genre.id)
  if (topics.length === 0) topics.push(OTHER_GENRE.id)
  return [...new Set([...topics, ...languages])]
}

export function allGenreDefs() {
  return [...TOPIC_GENRES, ...LANGUAGE_GENRES, OTHER_GENRE]
}
