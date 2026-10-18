'use strict'
// Decides where a link goes: stay in the app, open in the default browser, or be dropped.

const ALLOWED_HOSTS = ['threads.com', 'threads.net', 'instagram.com', 'facebook.com']
// Link-shim pages (https://l.threads.com/?u=<real url>) that Threads puts around outbound links.
const WRAPPER_HOSTS = ['l.threads.com', 'l.threads.net', 'l.instagram.com', 'l.facebook.com', 'lm.facebook.com']
const MAX_UNWRAP = 3

function parseWeb(url) {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed : null
  } catch {
    return null
  }
}

function isAllowedHost(hostname) {
  return ALLOWED_HOSTS.some((h) => hostname === h || hostname.endsWith(`.${h}`))
}

// -> { kind: 'internal' | 'external', url } or { kind: 'blocked' }.
// For wrapper pages, `url` is the unwrapped target, so callers never load the shim itself.
function classifyLink(url, depth = 0) {
  const parsed = parseWeb(url)
  if (!parsed) return { kind: 'blocked' }
  if (WRAPPER_HOSTS.includes(parsed.hostname)) {
    const target = parsed.searchParams.get('u')
    if (target) {
      if (depth >= MAX_UNWRAP) return { kind: 'blocked' }
      return classifyLink(target, depth + 1)
    }
  }
  return { kind: isAllowedHost(parsed.hostname) ? 'internal' : 'external', url }
}

function isWrapperUrl(url) {
  const parsed = parseWeb(url)
  return parsed !== null && WRAPPER_HOSTS.includes(parsed.hostname)
}

module.exports = { classifyLink, isWrapperUrl }
