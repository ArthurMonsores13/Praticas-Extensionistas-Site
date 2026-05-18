import { NextRequest, NextResponse } from "next/server";
import { appendAgendamento, getHorariosOcupados } from "@/lib/sheets";

export async function POST(req: NextRequest) {
  try {
    const { nome, idade, telefone, data, horario, motivo } =
      await req.json();

    if (!nome || !idade || !telefone || !data || !horario || !motivo) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    // Verifica conflito antes de salvar
    const ocupados = await getHorariosOcupados();
    const jaAgendado = ocupados.some(
      (item) => item.data === data && item.horario === horario
    );

    if (jaAgendado) {
      return NextResponse.json(
        { error: "Este horário já está ocupado. Por favor, escolha outro horário ou data." },
        { status: 409 }
      );
    }

    await appendAgendamento({ nome, idade, telefone, data, horario, motivo });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro ao salvar agendamento:", err);
    return NextResponse.json(
      { error: "Erro ao salvar. Tente novamente ou ligue para o consultório." },
      { status: 500 }
    );
  }
}
