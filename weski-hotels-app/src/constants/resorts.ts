export const RESORTS: { id: number; name: string }[] = [
  { id: 1, name: "Val Thorens" },
  { id: 2, name: "Courchevel" },
  { id: 3, name: "Tignes" },
  { id: 4, name: "La Plagne" },
  { id: 5, name: "Chamonix" },
];

export function getResortName(skiSiteId: number): string {
  return RESORTS.find((r) => r.id === skiSiteId)?.name ?? "Unknown Resort";
}
