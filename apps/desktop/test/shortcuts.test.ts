import { test } from 'vitest'
import assert from 'node:assert/strict'
import { eventToShortcutString, formatShortcutForDisplay, matchShortcut } from '../src/renderer/src/lib/shortcuts'
import type { KeyboardEventLike } from '../src/renderer/src/lib/shortcuts'

test('formatShortcutForDisplay formats modifiers and keys', () => {
  assert.equal(formatShortcutForDisplay('Mod+B'), '⌘B')
  assert.equal(formatShortcutForDisplay('Mod+Shift+S'), '⇧⌘S')
  assert.equal(formatShortcutForDisplay('Mod+,'), '⌘,')
  assert.equal(formatShortcutForDisplay('Mod+\\'), '⌘\\')
  assert.equal(formatShortcutForDisplay(''), '')
})

test('matchShortcut matches keys and modifiers correctly', () => {
  const modB: KeyboardEventLike = {
    key: 'b',
    metaKey: true,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
  }

  assert.equal(matchShortcut(modB, 'Mod+B'), true)
  assert.equal(matchShortcut(modB, 'Mod+N'), false)
  assert.equal(matchShortcut(modB, 'Mod+Shift+B'), false)

  const modShiftS = {
    key: 's',
    metaKey: true,
    ctrlKey: false,
    shiftKey: true,
    altKey: false,
  } as KeyboardEventLike

  assert.equal(matchShortcut(modShiftS, 'Mod+Shift+S'), true)
  assert.equal(matchShortcut(modShiftS, 'Mod+S'), false)

  const plainB = {
    key: 'b',
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
  } as KeyboardEventLike

  assert.equal(matchShortcut(plainB, 'Mod+B'), false)
})

test('eventToShortcutString validates and converts keyboard events', () => {
  // Lone modifier returns null
  assert.equal(
    eventToShortcutString({ key: 'Meta', metaKey: true, shiftKey: false, altKey: false, ctrlKey: false } as KeyboardEventLike),
    null,
  )

  // Plain key without modifier returns null
  assert.equal(
    eventToShortcutString({ key: 'a', metaKey: false, shiftKey: false, altKey: false, ctrlKey: false } as KeyboardEventLike),
    null,
  )

  // Mod+B returns Mod+B
  assert.equal(
    eventToShortcutString({ key: 'b', metaKey: true, shiftKey: false, altKey: false, ctrlKey: false } as KeyboardEventLike),
    'Mod+B',
  )

  // Mod+Shift+S returns Mod+Shift+S
  assert.equal(
    eventToShortcutString({ key: 's', metaKey: true, shiftKey: true, altKey: false, ctrlKey: false } as KeyboardEventLike),
    'Mod+Shift+S',
  )

  // Function key F1 works without modifier
  assert.equal(
    eventToShortcutString({ key: 'F1', metaKey: false, shiftKey: false, altKey: false, ctrlKey: false } as KeyboardEventLike),
    'F1',
  )
})
