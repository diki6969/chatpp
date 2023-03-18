declare module 'sse.js' {
  interface SSEOptions extends EventSourceInit {
    headers?: Record<string, string>
    payload?: string
    method?: string
  }

  export class SSE extends EventSource {
    constructor(url: string | URL, sseOptions?: SSEOptions)
    stream(): void
  }
}
