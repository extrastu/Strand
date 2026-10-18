import { useCallback } from 'react'
import type { PointerEvent } from 'react'

const INTERACTIVE = 'button, a, input, textarea, select, [role="menuitem"]'

/** Drag the window by a strip; done by hand because -webkit-app-region does not move this window. */
export function useWindowDrag() {
  return useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest(INTERACTIVE)) return
    const el = event.currentTarget
    el.setPointerCapture(event.pointerId)
    const startX = event.screenX
    const startY = event.screenY
    window.threads.windowDrag.start()
    const move = (e: globalThis.PointerEvent) => window.threads.windowDrag.move(e.screenX - startX, e.screenY - startY)
    const end = () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', end)
      el.removeEventListener('pointercancel', end)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', end)
    el.addEventListener('pointercancel', end)
  }, [])
}
