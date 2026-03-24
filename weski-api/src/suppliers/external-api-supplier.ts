import axios from "axios";
import { SupplierRuntimeConfig } from "../config/suppliers.js";
import { HotelResult, SearchQuery } from "../types/index.js";
import { BaseSupplier } from "./base-supplier.js";

export abstract class ExternalApiSupplier<TApiResponse, TExternalItem> extends BaseSupplier {
  protected abstract readonly config: SupplierRuntimeConfig;

  protected getGroupSizesToQuery(groupSize: number): number[] {
    const safeBaseGroupSize = Math.max(1, Math.min(groupSize, 10));
    const safeOffset = Math.max(0, this.config.additionalGroupSizeOffset);
    const maxGroupSize = Math.min(safeBaseGroupSize + safeOffset, 10);

    return Array.from(
      { length: maxGroupSize - safeBaseGroupSize + 1 },
      (_, index) => safeBaseGroupSize + index
    );
  }

  protected async fetchApiResponse(query: SearchQuery): Promise<TApiResponse> {
    const body = this.transformQuery(query);

    const { data } = await axios.post<TApiResponse>(this.config.apiUrl, body, {
      timeout: this.config.timeoutMs,
    });

    return data;
  }

  protected abstract extractItems(response: TApiResponse): TExternalItem[];

  protected abstract translateItems(
    items: TExternalItem[],
    originalQuery: SearchQuery
  ): HotelResult[];

  protected getDedupKey(result: HotelResult): string {
    return `${result.supplier}:${result.externalHotelId}:${result.roomCapacity}:${result.pricePerPerson}`;
  }

  async *search(query: SearchQuery): AsyncGenerator<HotelResult[]> {
    const groupSizesToQuery = this.getGroupSizesToQuery(query.group_size);
    console.log(`[${this.name}] groupSizesToQuery:`, groupSizesToQuery);
    const seenOptionIds = new Set<string>();

    for (const requestedGroupSize of groupSizesToQuery) {
      const queryForSize: SearchQuery = {
        ...query,
        group_size: requestedGroupSize,
      };

      const response = await this.fetchApiResponse(queryForSize);
      const items = this.extractItems(response);
      const translatedResults = this.translateItems(items, query);

      const deduplicatedBatch = translatedResults.filter((result) => {
        const optionId = this.getDedupKey(result);
        if (seenOptionIds.has(optionId)) {
          return false;
        }

        seenOptionIds.add(optionId);
        return true;
      });

      console.log(
        `[${this.name}] group_size=${requestedGroupSize} | before dedup: ${translatedResults.length} | after dedup: ${deduplicatedBatch.length}`
      );

      if (deduplicatedBatch.length > 0) {
        yield deduplicatedBatch;
      }
    }
  }
}
