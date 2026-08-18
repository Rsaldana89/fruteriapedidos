export function createOrderNumber(now = new Date()) {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(now)
    .replaceAll("-", "");
  const suffix = crypto.getRandomValues(new Uint32Array(1))[0] % 10000;
  return `ABF-${date}-${String(suffix).padStart(4, "0")}`;
}
