import { NextResponse } from "next/server";
import { getHorariosOcupados } from "@/lib/sheets";

export async function GET() {
  const ocupados = await getHorariosOcupados();
  return NextResponse.json(ocupados);
}
