import { Accommodation, HotelResult, SearchQuery } from "../../types/index.js";
import { hotelsSimulatorMapping } from "../mappings/hotels-simulator-mapping.js";
import { translateWithMapping } from "./translate-with-mapping.js";

/**
 * Supplier translator wrapper. Actual field mapping lives in a separate mapping file.
 */
export function translateHotelsSimulatorResults(
  accommodations: Accommodation[],
  query: SearchQuery,
  currency: string
): HotelResult[] {
  return translateWithMapping(accommodations, { query, currency }, hotelsSimulatorMapping);
}
