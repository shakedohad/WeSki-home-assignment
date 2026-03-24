import { HotelResult } from "../../types/index.js";

export type Resolver<TExternal, TValue, TContext> =
  | string
  | ((item: TExternal, context: TContext) => TValue);

export interface SupplierFieldMapping<TExternal, TContext> {
  supplier: Resolver<TExternal, string, TContext>;
  externalHotelId: Resolver<TExternal, string, TContext>;
  name: Resolver<TExternal, string, TContext>;
  resortName: Resolver<TExternal, string, TContext>;
  rating: Resolver<TExternal, number, TContext>;
  imageUrl: Resolver<TExternal, string, TContext>;
  pricePerPerson: Resolver<TExternal, number, TContext>;
  currency: Resolver<TExternal, string, TContext>;
  roomCapacity: Resolver<TExternal, number, TContext>;
}

function getByPath(source: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>((acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined), source);
}

function resolveValue<TExternal, TValue, TContext>(
  item: TExternal,
  context: TContext,
  resolver: Resolver<TExternal, TValue, TContext>
): TValue {
  if (typeof resolver === "function") {
    return resolver(item, context);
  }

  return getByPath(item, resolver) as TValue;
}

/**
 * Shared translator logic used by all suppliers.
 * Each supplier provides only a field mapping definition.
 */
export function translateWithMapping<TExternal, TContext>(
  items: TExternal[],
  context: TContext,
  mapping: SupplierFieldMapping<TExternal, TContext>
): HotelResult[] {
  return items.map((item) => ({
    supplier: resolveValue(item, context, mapping.supplier),
    externalHotelId: resolveValue(item, context, mapping.externalHotelId),
    name: resolveValue(item, context, mapping.name),
    resortName: resolveValue(item, context, mapping.resortName),
    rating: Number(resolveValue(item, context, mapping.rating)) || 0,
    imageUrl: resolveValue(item, context, mapping.imageUrl) ?? "",
    pricePerPerson: Number(resolveValue(item, context, mapping.pricePerPerson)) || 0,
    currency: resolveValue(item, context, mapping.currency),
    roomCapacity: Number(resolveValue(item, context, mapping.roomCapacity)) || 0,
  }));
}
