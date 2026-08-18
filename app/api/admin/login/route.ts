import { NextResponse } from "next/server";
import { createAdminSession, verifyAdminCredentials } from "@/src/server/admin-session";

export async function POST(request: Request) {
  const { user, password } = await request.json();
  try {
    const identity = await verifyAdminCredentials(String(user || ""), String(password || ""));
    if (!identity) {
      return NextResponse.json({ error: "Credenciales incorrectas o acceso no configurado." }, { status: 401 });
    }
    await createAdminSession(identity.username);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      "No fue posible autenticar al administrador en MySQL",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json({ error: "No fue posible consultar la base de datos." }, { status: 503 });
  }
}
