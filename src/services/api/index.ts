export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get(
    fileName: string,
    { timeout = 10000, revalidate = 3600 } = {
      timeout: 10000,
      revalidate: 3600,
    }
  ): Promise<any> {
    const url = `${this.baseUrl}/${fileName}`;
    const controller = new AbortController();
    const abortTimeout = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        next: { revalidate },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out");
      }
      throw error;
    } finally {
      clearTimeout(abortTimeout);
    }
  }
}
