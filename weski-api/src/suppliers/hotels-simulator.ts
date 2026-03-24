import { supplierConfigs } from "../config/suppliers.js";
import { HotelResult, HotelsSimulatorResponse, SearchQuery } from "../types/index.js";
import { ExternalApiSupplier } from "./external-api-supplier.js";
import { translateHotelsSimulatorResults } from "./translators/hotels-simulator-translator.js";

const config = supplierConfigs.hotelsSimulator;

/**
 * HotelsSimulator supplier — integrates with the WeSki Hotels Simulator API.
 *
 * The external API returns a wrapped response: { statusCode, body: { accommodations[] } }.
 * This supplier unwraps it and yields the accommodations array as one batch so the
 * SSE router can forward results to the client as soon as they are ready.
 */
export class HotelsSimulatorSupplier extends ExternalApiSupplier<
  HotelsSimulatorResponse,
  HotelsSimulatorResponse["body"]["accommodations"][number]
> {
  readonly name = "hotels-simulator";
  protected readonly config = config;

  protected extractItems(
    response: HotelsSimulatorResponse
  ): HotelsSimulatorResponse["body"]["accommodations"] {
    const accommodations = response?.body?.accommodations;
    if (!Array.isArray(accommodations)) {
      throw new Error("HotelsSimulator API returned unexpected response shape");
    }

    return accommodations;
  }

  protected translateItems(
    items: HotelsSimulatorResponse["body"]["accommodations"],
    originalQuery: SearchQuery
  ): HotelResult[] {
    return translateHotelsSimulatorResults(items, originalQuery, this.config.currency);
  }
}
