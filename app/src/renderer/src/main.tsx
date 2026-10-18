import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { toast } from 'sonner'
import './styles/globals.css'
import { App } from '@/components/app'
import { useAppStore } from '@/store/app-store'

// Follow the system appearance (shadcn convention: a `dark` class on <html>).
const media = window.matchMedia('(prefers-color-scheme: dark)')
const syncTheme = () => document.documentElement.classList.toggle('dark', media.matches)
syncTheme()
media.addEventListener('change', syncTheme)

// Account pages are native views above the renderer: hide them while a dialog is open.
useAppStore.subscribe((state, prev) => {
  const open = state.dialog !== null
  if (open !== (prev.dialog !== null)) {
    window.threads.overlay.set(open).catch(() => toast.error('界面状态同步失败,请重试。'))
  }
})

void useAppStore.getState().init()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
