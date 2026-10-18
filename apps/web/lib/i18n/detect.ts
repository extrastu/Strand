import type { Language } from './content'

/**
 * Detects the user's preferred language following browser settings.
 * If the language is unsupported or cannot be matched, it falls back to 'en'.
 */
export function matchLanguage(candidateLanguages: readonly string[]): Language {
  for (const raw of candidateLanguages) {
    if (!raw) continue
    const lower = raw.toLowerCase().trim()
    if (lower.startsWith('zh')) {
      return 'zh-CN'
    }
    if (lower.startsWith('en')) {
      return 'en'
    }
  }
  // Fallback to 'en' if no supported language matches
  return 'en'
}

/**
 * Resolves the language for web client:
 * 1. Checks localStorage for explicit manual selection
 * 2. Follows browser language preference (navigator.languages / navigator.language)
 * 3. Falls back to 'en'
 */
export function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en'

  // Check saved manual preference
  try {
    const saved = localStorage.getItem('strand_lang')
    if (saved === 'zh-CN' || saved === 'en') {
      return saved
    }
  } catch {
    // localStorage may be restricted or unavailable
  }

  // Check browser preferences
  const candidates: string[] = []
  if (Array.isArray(navigator.languages)) {
    candidates.push(...navigator.languages)
  }
  if (navigator.language) {
    candidates.push(navigator.language)
  }

  return matchLanguage(candidates)
}
