import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/src/server/orders-repository";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "abf-alimentos",
    databaseConfigured: isDatabaseConfigured(),
    timestamp: new Date().toISOString(),
  });
}
