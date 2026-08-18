import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import XLSX from "xlsx";

const defaultSource = path.join(
  process.cwd(),
  "sources/originals/LP FRUTAS Y VERDURAS 29_JUL (1).xlsx",
);
const source = path.resolve(process.argv[2] || defaultSource);
const output = path.join(process.cwd(), "src/data/products.json");

if (!fs.existsSync(source)) {
  console.error(`No se encontró el Excel: ${source}`);
  process.exit(1);
}

const normalize = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
const slug = (value) =>
  normalize(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const chilesSecos = [
  "CHILE ANCHO",
  "CHILE CASCABEL",
  "CHILE CHIPOTLE",
  "CHILE DE ARBOL",
  "CHILE GUAJILLO",
  "CHILE MORITA",
  "CHILE MULATO",
  "CHILE PASILLA",
  "CHILE PUYA",
];
const abarrotes = [
  "ARROZ",
  "AVENA",
  "AZUCAR",
  "CANELA",
  "CHICHARRON",
  "HUEVO",
  "JAMAICA",
  "PILONCILLO",
  "SOYA TEXTURIZADA",
];
const granosSemillas = [
  "ALMENDRA",
  "CACAHUATE",
  "FRIJOL",
  "HABA SECA",
  "MIX DE NUECES",
  "NUEZ",
  "PEPITA",
  "PISTACHE",
];
const otros = ["HIERBAS DE OLOR", "HOJA DE AGUACATE", "LAUREL"];

function categoryFor(name) {
  if (chilesSecos.some((term) => name.startsWith(term))) return "Chiles secos";
  if (abarrotes.some((term) => name.includes(term))) return "Abarrotes";
  if (granosSemillas.some((term) => name.includes(term))) return "Granos y semillas";
  if (otros.some((term) => name.includes(term))) return "Otros";
  return "Frutas y verduras";
}

const workbook = XLSX.readFile(source, { cellDates: false });
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

const products = rows.slice(2).flatMap((row, index) => {
  const name = normalize(row[0]);
  const unit = normalize(row[1]);
  const price = Number(row[3]);
  if (!name || !unit || !Number.isFinite(price)) return [];
  return [
    {
      id: `${slug(name)}-${index + 1}`,
      name,
      unit,
      price: Number(price.toFixed(2)),
      category: categoryFor(name),
    },
  ];
});

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(products, null, 2)}\n`);
console.log(`Catálogo actualizado: ${products.length} productos en ${output}`);
