export interface SearchQuery {
  ski_site: number;
  from_date: string; // MM/DD/YYYY
  to_date: string;   // MM/DD/YYYY
  group_size: number;
}

export interface SearchRequest {
  query: SearchQuery;
}

export interface SSEEvent {
  type: "results" | "done" | "error";
  data?: unknown[];
  message?: string;
}

// ── Internal WeSki lexicon model ───────────────────────────────────────────

export interface HotelResult {
  supplier: string;
  externalHotelId: string;
  name: string;
  resortName: string;
  rating: number;
  imageUrl: string;
  pricePerPerson: number;
  currency: string;
  roomCapacity: number;
}

// ── Hotels Simulator API response shape ────────────────────────────────────

export interface HotelImage {
  URL: string;
  MainImage?: string; // "True" when this is the primary image
}

export interface HotelDistance {
  type: "ski_lift" | "city_center" | string;
  distance: string;
}

export interface Accommodation {
  HotelCode: string;
  HotelName: string;
  HotelDescriptiveContent: {
    Images: HotelImage[];
  };
  HotelInfo: {
    Position: {
      Latitude: string;
      Longitude: string;
      Distances: HotelDistance[];
    };
    Rating: string; // "1"–"5"
    Beds: string;
  };
  PricesInfo: {
    AmountAfterTax: string;
    AmountBeforeTax: string;
  };
}

export interface HotelsSimulatorResponse {
  statusCode: number;
  body: {
    success: string;
    accommodations: Accommodation[];
  };
}
