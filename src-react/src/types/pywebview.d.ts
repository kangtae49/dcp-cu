export {};

declare global {
  interface Window {
    pywebview: {
      api: {
        write_file(fullpath: string, content: string): Promise<void>,
        start_script(job_id: string, subpath: string, args: string[]): Promise<void>,
        stop_script(job_id: string): Promise<void>,
      },
    },

  }
}
