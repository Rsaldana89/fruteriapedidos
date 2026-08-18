import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log("DATABASE_URL no está configurada. MySQL permanece desactivado.");
  process.exit(0);
}

const schemaPath = path.join(process.cwd(), "db", "mysql-schema.sql");

try {
  const schema = await fs.readFile(schemaPath, "utf8");
  const statements = schema
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
  const connection = await mysql.createConnection(databaseUrl);
  for (const statement of statements) {
    await connection.query(statement);
  }

  const bootstrapUser = process.env.ADMIN_BOOTSTRAP_USER?.trim();
  const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  const bootstrapDisplayName = process.env.ADMIN_BOOTSTRAP_DISPLAY_NAME?.trim() || null;

  if (Boolean(bootstrapUser) !== Boolean(bootstrapPassword)) {
    throw new Error("Configura ADMIN_BOOTSTRAP_USER y ADMIN_BOOTSTRAP_PASSWORD juntos.");
  }

  if (bootstrapUser && bootstrapPassword) {
    if (!/^[a-zA-Z0-9._-]{3,80}$/.test(bootstrapUser)) {
      throw new Error("ADMIN_BOOTSTRAP_USER debe tener 3-80 caracteres: letras, números, punto, guion o guion bajo.");
    }
    if (bootstrapPassword.length < 12) {
      throw new Error("ADMIN_BOOTSTRAP_PASSWORD debe tener al menos 12 caracteres.");
    }

    const passwordHash = await bcrypt.hash(bootstrapPassword, 12);
    await connection.execute(
      `INSERT INTO admin_users (username, password_hash, display_name, active)
       VALUES (?, ?, ?, TRUE)
       ON DUPLICATE KEY UPDATE
         password_hash = VALUES(password_hash),
         display_name = VALUES(display_name),
         active = TRUE`,
      [bootstrapUser, passwordHash, bootstrapDisplayName],
    );
    console.log(`Usuario administrador preparado en MySQL: ${bootstrapUser}`);
  }

  await connection.end();
  console.log(`Base de datos ABF preparada correctamente (${statements.length} operaciones).`);
} catch (error) {
  console.error(
    "No fue posible preparar MySQL:",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
}
