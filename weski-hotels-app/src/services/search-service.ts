import { SearchParams, SSEEvent } from "../types";

const API_BASE_URL = "";

/**
 * Sends a hotel search request to the server and streams results via SSE.
 *
 * @param params   - The search parameters derived from the search form.
 * @param onResults - Called with each batch of results as they stream in.
 * @param onDone    - Called when the server signals the stream is complete.
 * @param onError   - Called if a network or server error occurs.
 * @returns A cleanup function that aborts the request when called.
 */
export function streamSearchResults(
  params: SearchParams,
  onResults: (results: unknown[]) => void,
  onDone: () => void,
  onError: (message: string) => void
): () => void {
  const controller = new AbortController();

  (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: params }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        onError(`Server responded with status ${response.status}`);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE messages are separated by double newlines
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data: ")) continue;

          try {
            const event = JSON.parse(line.slice(6)) as SSEEvent;

            if (event.type === "results" && event.data) {
              onResults(event.data);
            } else if (event.type === "done") {
              onDone();
            } else if (event.type === "error") {
              onError(event.message ?? "Unknown server error");
            }
          } catch {
            // Ignore malformed SSE frames
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        onError(err.message);
      }
    }
  })();

  return () => controller.abort();
}
