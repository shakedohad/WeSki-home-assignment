export interface SearchParams {
  ski_site: number;
  from_date: string; // MM/DD/YYYY
  to_date: string;   // MM/DD/YYYY
  group_size: number;
}

export interface SSEEvent {
  type: "results" | "done" | "error";
  data?: unknown[];
  message?: string;
}

export interface Hotel {
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
