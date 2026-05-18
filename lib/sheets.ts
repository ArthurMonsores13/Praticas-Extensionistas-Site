export interface HorarioOcupado {
  data: string;
  horario: string;
}

interface DadosAgendamento {
  nome: string;
  idade: string;
  telefone: string;
  data: string;
  horario: string;
  motivo: string;
}

export async function appendAgendamento(dados: DadosAgendamento) {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url) throw new Error("APPS_SCRIPT_URL não configurado no .env.local.");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(dados),
    redirect: "manual",
  });

  const scriptExecutou =
    res.type === "opaqueredirect" ||
    res.status === 0 ||
    (res.status >= 300 && res.status < 400);

  if (!scriptExecutou) {
    const text = await res.text().catch(() => "(vazio)");
    console.error(`[Sheets] status ${res.status}, type: ${res.type}:`, text.slice(0, 300));
    throw new Error(`Erro ao salvar (status ${res.status}).`);
  }
}

export async function getHorariosOcupados(): Promise<HorarioOcupado[]> {
  const url = process.env.APPS_SCRIPT_URL;
  if (!url) return [];

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}
