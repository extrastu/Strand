import { LandingPage } from '@/components/LandingPage'

export default function Home() {
  return (
    <>
      <noscript>
        <div className="p-8 max-w-3xl mx-auto font-sans leading-relaxed">
          <h1 className="text-2xl font-bold mb-4">
            Strand — Elegant Multi-Account Client for Threads on macOS
          </h1>
          <p className="mb-4 text-neutral-700">
            Strand is an unofficial, native-inspired desktop client for Threads on macOS. Seamlessly manage
            multiple Threads accounts with isolated partitions, pure monochrome aesthetics, and privacy-first local storage.
          </p>
          <h2 className="text-xl font-semibold mb-2">Key Features</h2>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-neutral-600">
            <li><strong>Isolated Multi-Account Sessions</strong>: Each account lives in its own sandboxed partition with zero shared cookies.</li>
            <li><strong>Monochrome Mac Aesthetics</strong>: Pure black-and-white palette inspired by Threads and Claude desktop geometry.</li>
            <li><strong>Privacy by Design</strong>: Zero middleman servers, no telemetry, pure local storage.</li>
            <li><strong>Keyboard Navigation</strong>: ⌘B to toggle sidebar, ⌘1~9 to switch accounts instantly.</li>
          </ul>
          <h2 className="text-xl font-semibold mb-2">Download for macOS</h2>
          <p className="text-neutral-700">
            Official Apple Silicon (.dmg) and Portable (.zip) releases are hosted on{' '}
            <a
              href="https://github.com/extrastu/Strand/releases/tag/v0.2.1"
              className="text-blue-600 underline"
            >
              GitHub Releases
            </a>
            .
          </p>
        </div>
      </noscript>
      <LandingPage />
    </>
  )
}
