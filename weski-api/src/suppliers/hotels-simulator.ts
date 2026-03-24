import axios from "axios";
import { BaseSupplier } from "./base-supplier.js";
import { SearchQuery, HotelsSimulatorResponse } from "../types/index.js";
import { supplierConfigs } from "../config/suppliers.js";
import { translateHotelsSimulatorResults } from "./translators/hotels-simulator-translator.js";

const config = supplierConfigs.hotelsSimulator;

/**
 * HotelsSimulator supplier — integrates with the WeSki Hotels Simulator API.
 *
 * The external API returns a wrapped response: { statusCode, body: { accommodations[] } }.
 * This supplier unwraps it and yields the accommodations array as one batch so the
 * SSE router can forward results to the client as soon as they are ready.
 */
export class HotelsSimulatorSupplier extends BaseSupplier {
  readonly name = "hotels-simulator";

  private getGroupSizesToQuery(groupSize: number): number[] {
    const safeBaseGroupSize = Math.max(1, Math.min(groupSize, 10));
    const safeOffset = Math.max(0, config.additionalGroupSizeOffset);
    const maxGroupSize = Math.min(safeBaseGroupSize + safeOffset, 10);

    return Array.from(
      { length: maxGroupSize - safeBaseGroupSize + 1 },
      (_, index) => safeBaseGroupSize + index
    );
  }

  async *search(query: SearchQuery): AsyncGenerator<unknown[]> {
    const groupSizesToQuery = this.getGroupSizesToQuery(query.group_size);
    console.log("[hotels-simulator] groupSizesToQuery:", groupSizesToQuery);
    const seenOptionIds = new Set<string>();

    for (const requestedGroupSize of groupSizesToQuery) {
      const queryForSize: SearchQuery = {
        ...query,
        group_size: requestedGroupSize,
      };

      const body = this.transformQuery(queryForSize);
    //   console.log(
    //     `[hotels-simulator] calling external API for group_size=${requestedGroupSize} with:`,
    //     JSON.stringify(body)
    //   );

      const { data } = await axios.post<HotelsSimulatorResponse>(config.apiUrl, body, {
        timeout: config.timeoutMs,
      });
    //   console.log(
    //     `[hotels-simulator] raw response for group_size=${requestedGroupSize}:`,
    //     JSON.stringify(data).slice(0, 300)
    //   );

      const accommodations = data?.body?.accommodations;
      if (!Array.isArray(accommodations)) {
        throw new Error("HotelsSimulator API returned unexpected response shape");
      }

      const translatedResults = translateHotelsSimulatorResults(
        accommodations,
        query,
        config.currency
      );

      const deduplicatedBatch = translatedResults.filter((hotel) => {
        const optionId = `${hotel.supplier}:${hotel.externalHotelId}:${hotel.roomCapacity}:${hotel.pricePerPerson}`;
        if (seenOptionIds.has(optionId)) {
          return false;
        }

        seenOptionIds.add(optionId);
        return true;
      });

      console.log(
        `[hotels-simulator] group_size=${requestedGroupSize} | before dedup: ${translatedResults.length} | after dedup: ${deduplicatedBatch.length}`
      );

      if (deduplicatedBatch.length > 0) {
        yield deduplicatedBatch;
      }
    }
  }
}
