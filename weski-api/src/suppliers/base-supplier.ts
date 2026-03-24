import { HotelResult, SearchQuery } from "../types/index.js";

/**
 * Abstract base class for hotel search suppliers.
 * Each supplier implementation wraps a specific external API integration
 * and can apply custom request/response transformations.
 */
export abstract class BaseSupplier {
  abstract readonly name: string;

  /**
   * Perform a hotel search and yield result batches as they become available.
   * Implementing classes should yield at least one batch as early as possible
   * to allow the client to start rendering results without waiting for all data.
   */
  abstract search(query: SearchQuery): AsyncGenerator<HotelResult[]>;

  /**
   * Optional hook to transform the outgoing query before it is sent
   * to the external API. Override in subclasses for supplier-specific
   * field mapping or enrichment.
   */
  protected transformQuery(query: SearchQuery): unknown {
    return { query };
  }
}
