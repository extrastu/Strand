'use strict'
const test = require('node:test')
const assert = require('node:assert/strict')
const { classifyLink, isWrapperUrl } = require('../src/links')

const wrap = (host, target) => `https://${host}/?u=${encodeURIComponent(target)}&e=abc`

test('threads, instagram and facebook pages stay in the app', () => {
  for (const url of [
    'https://www.threads.com/login',
    'https://threads.net/@someone',
    'https://www.instagram.com/accounts/login/',
    'https://m.facebook.com/dialog/oauth',
  ]) {
    assert.deepEqual(classifyLink(url), { kind: 'internal', url })
  }
})

test('other hosts, including lookalikes, go to the default browser', () => {
  for (const url of [
    'https://example.com/a',
    'http://example.com/a',
    'https://evilthreads.com/',
    'https://threads.com.evil.io/',
    'https://threads.com@evil.io/',
  ]) {
    assert.deepEqual(classifyLink(url), { kind: 'external', url })
  }
})

test('non-http(s) schemes and garbage are blocked, never opened', () => {
  for (const url of ['javascript:alert(1)', 'file:///etc/passwd', 'mailto:a@b.c', 'about:blank', 'not a url', '']) {
    assert.deepEqual(classifyLink(url), { kind: 'blocked' })
  }
})

test('a link-wrapper page is unwrapped to its real external target', () => {
  const target = 'https://example.com/page?x=1&y=2'
  for (const host of ['l.threads.com', 'l.threads.net', 'l.instagram.com', 'l.facebook.com', 'lm.facebook.com']) {
    assert.deepEqual(classifyLink(wrap(host, target)), { kind: 'external', url: target })
  }
})

test('a wrapper pointing back into Threads loads the inner page in the app', () => {
  const inner = 'https://www.threads.com/@someone/post/abc'
  assert.deepEqual(classifyLink(wrap('l.threads.com', inner)), { kind: 'internal', url: inner })
})

test('a wrapper whose target is not http(s) is blocked', () => {
  assert.deepEqual(classifyLink(wrap('l.threads.com', 'javascript:alert(1)')), { kind: 'blocked' })
  assert.deepEqual(classifyLink(wrap('l.threads.com', 'not a url')), { kind: 'blocked' })
})

test('a wrapper without a usable target is treated as an ordinary in-app page', () => {
  const url = 'https://l.threads.com/?foo=bar'
  assert.deepEqual(classifyLink(url), { kind: 'internal', url })
})

test('nested wrappers are followed a bounded number of times', () => {
  let url = 'https://example.com/end'
  for (let i = 0; i < 10; i++) url = wrap('l.threads.com', url)
  assert.equal(classifyLink(url).kind, 'blocked')
})

test('isWrapperUrl recognises wrapper pages only', () => {
  assert.equal(isWrapperUrl('https://l.threads.com/?u=x'), true)
  assert.equal(isWrapperUrl('https://www.threads.com/'), false)
  assert.equal(isWrapperUrl('not a url'), false)
})
