export {};

declare global {
  interface Window {
    pywebview: {
      api: {
        write_file(fullpath: string, content: string): Promise<void>
      },
    },

  }
}
