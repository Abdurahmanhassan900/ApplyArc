export const THEMES = [
  {
    id: "glass",
    specimen: "01",
    name: "Liquid Glass",
    shortName: "Glass",
    swatch: "linear-gradient(135deg, #e8f8ff, #c8d5ff 48%, #f3ddff)",
    blurb: "Frosted surfaces over a luminous gradient field.",
  },
  {
    id: "clay",
    specimen: "02",
    name: "Soft Clay",
    shortName: "Clay",
    swatch: "linear-gradient(135deg, #f6f0e8, #dccfc0)",
    blurb: "Matte, softly extruded controls with warm depth.",
  },
  {
    id: "spatial",
    specimen: "03",
    name: "Spatial Depth",
    shortName: "Spatial",
    swatch: "linear-gradient(135deg, #111827, #25456f 52%, #82d8d0)",
    blurb: "Floating acrylic layers in a deep atmospheric field.",
  },
  {
    id: "brutal",
    specimen: "04",
    name: "Brutalist",
    shortName: "Brutal",
    swatch:
      "linear-gradient(135deg, #fff 48%, #000 49%, #000 55%, #f8e71c 56%)",
    blurb: "Hard borders, flat ink, and zero-radius utility.",
  },
  {
    id: "minimax",
    specimen: "05",
    name: "Minimal · Maximal",
    shortName: "Minimax",
    swatch: "linear-gradient(135deg, #fafafa, #fafafa 52%, #171717 53%)",
    blurb: "Quiet rules carrying oversized numbers and dense metadata.",
  },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}
