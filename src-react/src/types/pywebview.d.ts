export {};

declare global {
  interface Window {
    pywebview: {
      api: {
        write_file(fullpath: string, content: string): Promise<void>,
        start_script(job_id: string, subpath: string, args: string[]): Promise<void>,
        stop_script(job_id: string): Promise<void>,
        start_data_file(subpath: string): Promise<void>,
        start_file(filepath: string): Promise<void>,
      },
    },

  }
}
