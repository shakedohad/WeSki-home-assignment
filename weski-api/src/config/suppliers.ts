export interface SupplierRuntimeConfig {
  apiUrl: string;
  timeoutMs: number;
  currency: string;
  additionalGroupSizeOffset: number;
}

export const supplierConfigs: Record<string, SupplierRuntimeConfig> = {
  hotelsSimulator: {
    apiUrl:
      process.env.HOTELS_SIMULATOR_API_URL ??
      "https://gya7b1xubh.execute-api.eu-west-2.amazonaws.com/default/HotelsSimulator",
    timeoutMs: Number(process.env.HOTELS_SIMULATOR_TIMEOUT_MS ?? 15000),
    currency: process.env.HOTELS_SIMULATOR_CURRENCY ?? "EUR",
    additionalGroupSizeOffset: Number(
      process.env.HOTELS_SIMULATOR_ADDITIONAL_GROUP_SIZE_OFFSET ?? 2
    ),
  },
};
