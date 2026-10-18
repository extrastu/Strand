/// <reference types="vite/client" />
import type { ThreadsApi } from '@shared/types'

declare global {
  interface Window {
    threads: ThreadsApi
  }
}
