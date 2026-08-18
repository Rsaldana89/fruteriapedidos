export const company = {
  name: "ABF Maxi Alimentos",
  shortName: "ABF",
  slogan: "Cultivamos confianza. Entregamos calidad.",
  phoneDisplay: "442 710 1006",
  phoneHref: "+524427101006",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "524422009394",
  email: "abfmaxialimentos@gmail.com",
  address:
    "Paseo Constituyentes #1602, Col. El Pueblito, Corregidora, Qro. C.P. 76900",
  instagram: "@abf_maxialimentos",
  instagramUrl: "https://www.instagram.com/abf_maxialimentos/",
  coverage: "Querétaro",
} as const;

export const showPrices = process.env.NEXT_PUBLIC_SHOW_PRICES !== "false";
