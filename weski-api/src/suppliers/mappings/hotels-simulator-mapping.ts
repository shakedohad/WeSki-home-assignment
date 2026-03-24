import { Accommodation, SearchQuery } from "../../types/index.js";
import { SupplierFieldMapping } from "../translators/translate-with-mapping.js";

const RESORT_NAMES_BY_ID: Record<number, string> = {
  1: "Val Thorens",
  2: "Courchevel",
  3: "Tignes",
  4: "La Plagne",
  5: "Chamonix",
};

function getResortNameById(skiSiteId: number): string {
  return RESORT_NAMES_BY_ID[skiSiteId] ?? "Unknown Resort";
}

function getMainImageUrl(images: Accommodation["HotelDescriptiveContent"]["Images"]): string {
  const mainImage = images.find((image) => image.MainImage === "True");
  return (mainImage ?? images[0])?.URL ?? "";
}

export interface HotelsSimulatorMappingContext {
  query: SearchQuery;
  currency: string;
}

export const hotelsSimulatorMapping: SupplierFieldMapping<
  Accommodation,
  HotelsSimulatorMappingContext
> = {
  supplier: () => "hotels-simulator",
  externalHotelId: "HotelCode",
  name: "HotelName",
  resortName: (_item, context) => getResortNameById(context.query.ski_site),
  rating: (item) => Number(item.HotelInfo.Rating) || 0,
  imageUrl: (item) => getMainImageUrl(item.HotelDescriptiveContent.Images),
  pricePerPerson: (item) => Number(item.PricesInfo.AmountAfterTax) || 0,
  currency: (_item, context) => context.currency,
  roomCapacity: (item) => Number(item.HotelInfo.Beds) || 0,
};
