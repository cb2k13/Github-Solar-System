export const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Shell: '#89e051',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  R: '#198CE7',
  default: '#8b949e',
}

export function getLangColor(language) {
  return LANGUAGE_COLORS[language] ?? LANGUAGE_COLORS.default
}

export const LANGUAGE_EMOJIS = {
  JavaScript: 'JS',
  TypeScript: 'TS',
  Python: 'PY',
  Java: 'JV',
  'C++': 'C+',
  C: 'C',
  'C#': 'C#',
  Ruby: 'RB',
  Go: 'GO',
  Rust: 'RS',
  Swift: 'SW',
  Kotlin: 'KT',
  PHP: 'PHP',
  HTML: 'HTML',
  CSS: 'CSS',
  Vue: 'VUE',
  Shell: 'SH',
  default: '?',
}
