import bcrypt from "bcryptjs";

export type AdminIdentity = {
  id: number;
  username: string;
  displayName: string | null;
};

function databaseUrl() {
  return process.env.DATABASE_URL;
}

async function mysqlModule() {
  const moduleName = "mysql2/promise";
  return import(/* @vite-ignore */ moduleName);
}

async function connection() {
  const url = databaseUrl();
  if (!url) return null;
  const mysql = await mysqlModule();
  return mysql.createConnection(url);
}

export async function authenticateAdminUser(
  username: string,
  password: string,
): Promise<AdminIdentity | null> {
  const url = databaseUrl();
  if (!url || !username || !password) return null;

  const db = await connection();
  if (!db) return null;
  try {
    const [rows] = await db.execute(
      `SELECT id, username, password_hash AS passwordHash, display_name AS displayName
       FROM admin_users
       WHERE username = ? AND active = TRUE
       LIMIT 1`,
      [username],
    );
    const user = (rows as Array<AdminIdentity & { passwordHash: string }>)[0];
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return null;

    await db.execute(
      "UPDATE admin_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?",
      [user.id],
    );
    return { id: Number(user.id), username: user.username, displayName: user.displayName };
  } finally {
    await db.end();
  }
}

export async function isAdminUserActive(username: string) {
  const url = databaseUrl();
  if (!url) return false;

  const db = await connection();
  if (!db) return false;
  try {
    const [rows] = await db.execute(
      "SELECT id FROM admin_users WHERE username = ? AND active = TRUE LIMIT 1",
      [username],
    );
    return (rows as Array<{ id: number }>).length === 1;
  } finally {
    await db.end();
  }
}
