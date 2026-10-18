// electron-vite resolves `?asset` imports to a file path that also works from the packaged app.
declare module '*?asset' {
  const path: string
  export default path
}
