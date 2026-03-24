import { Router, Request, Response } from "express";
import { HotelsSimulatorSupplier } from "../suppliers/hotels-simulator.js";
import { SearchRequest, SSEEvent } from "../types/index.js";

const router = Router();

// All active suppliers — add new suppliers here to fan out searches in parallel
const suppliers = [new HotelsSimulatorSupplier()];

function sendSSE(res: Response, event: SSEEvent): void {
  if (!res.writableEnded) {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  }
}

router.post("/", async (req: Request, res: Response) => {
  const { query } = req.body as SearchRequest;
  console.log("[search] incoming request body:", JSON.stringify(req.body));

  if (!query?.ski_site || !query?.from_date || !query?.to_date || !query?.group_size) {
    console.warn("[search] missing query parameters, returning 400");
    res.status(400).json({ error: "Missing required query parameters" });
    return;
  }

  // Set SSE headers — keep the connection open for streaming
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  console.log("[search] SSE headers flushed, starting supplier fan-out");

  // Detect client disconnect during streaming
  res.on("close", () => {
    console.log("[search] client disconnected");
  });

  try {
    // Fan out to all suppliers concurrently and stream each batch as it arrives
    await Promise.all(
      suppliers.map(async (supplier) => {
        console.log(`[search] starting supplier: ${supplier.name}`);
        for await (const batch of supplier.search(query)) {
          console.log(`[search] got batch from ${supplier.name}: ${batch.length} items`);
          sendSSE(res, { type: "results", data: batch });
        }
        console.log(`[search] supplier finished: ${supplier.name}`);
      })
    );

    console.log("[search] all suppliers done, sending done event");
    sendSSE(res, { type: "done" });
  } catch (error) {
    console.error("[search] error:", error);
    sendSSE(res, {
      type: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  } finally {
    res.end();
  }
});

export default router;
