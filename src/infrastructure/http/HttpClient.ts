export interface HttpClient {
  getJSON<T>(url: string): Promise<T>;
}

/** Implementasi fetch Next.js dengan cache ISR + timeout. */
export class FetchHttpClient implements HttpClient {
  constructor(private readonly revalidateSeconds = 3600, private readonly timeoutMs = 8000) {}

  async getJSON<T>(url: string): Promise<T> {
    const res = await fetch(url, {
      next: { revalidate: this.revalidateSeconds },
      signal: AbortSignal.timeout(this.timeoutMs),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return (await res.json()) as T;
  }
}
