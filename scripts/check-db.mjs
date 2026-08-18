import process from "node:process";
import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL no está configurada.");
  process.exit(1);
}

try {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const [rows] = await connection.query(
    "SELECT DATABASE() AS databaseName, VERSION() AS mysqlVersion, COUNT(*) AS orderCount FROM orders",
  );
  await connection.end();
  console.log("Conexión MySQL correcta:", rows[0]);
} catch (error) {
  console.error(
    "La comprobación de MySQL falló:",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
}
