"use client";

import { useState, useEffect } from "react";

interface FormData {
  nome: string;
  idade: string;
  telefone: string;
  data: string;
  horario: string;
  motivo: string;
}

interface HorarioOcupado {
  data: string;
  horario: string;
}

const HORARIOS = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

const initialForm: FormData = {
  nome: "",
  idade: "",
  telefone: "",
  data: "",
  horario: "",
  motivo: "",
};

export default function AgendamentoForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [erroTelefone, setErroTelefone] = useState(false);
  const [erroMotivo, setErroMotivo] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroServidor, setErroServidor] = useState("");
  const [ocupados, setOcupados] = useState<HorarioOcupado[]>([]);

  useEffect(() => {
    fetch("/api/disponibilidade")
      .then((r) => r.json())
      .then((data) => setOcupados(data))
      .catch(() => {}); // falha silenciosa — validação server-side ainda protege
  }, []);

  function isOcupado(horario: string) {
    return ocupados.some(
      (item) => item.data === form.data && item.horario === horario
    );
  }

  function handleTelefone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    let masked = "";
    if (digits.length > 0) masked = "(" + digits.slice(0, 2);
    if (digits.length >= 3) masked += ") " + digits.slice(2, 7);
    if (digits.length >= 8) masked += "-" + digits.slice(7, 11);
    setForm((f) => ({ ...f, telefone: masked }));
    setErroTelefone(digits.length > 0 && digits.length < 11);
  }

  function handleTelefoneKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const permitidas = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"];
    if (!permitidas.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  }

  function handleDataChange(novaData: string) {
    // Ao mudar a data, limpa o horário se o selecionado ficou ocupado
    setForm((f) => {
      const horarioAindaValido =
        f.horario &&
        !ocupados.some((item) => item.data === novaData && item.horario === f.horario);
      return { ...f, data: novaData, horario: horarioAindaValido ? f.horario : "" };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErroServidor("");

    const digits = form.telefone.replace(/\D/g, "");
    let valido = true;

    if (digits.length !== 11) {
      setErroTelefone(true);
      valido = false;
    } else {
      setErroTelefone(false);
    }

    if (!form.motivo) {
      setErroMotivo(true);
      valido = false;
    } else {
      setErroMotivo(false);
    }

    if (!valido) return;

    setEnviando(true);
    try {
      const res = await fetch("/api/agendamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao salvar agendamento.");
      }

      setConfirmado(true);
      setForm(initialForm);

      // Recarrega disponibilidade após agendamento
      fetch("/api/disponibilidade")
        .then((r) => r.json())
        .then((d) => setOcupados(d))
        .catch(() => {});
    } catch (err: unknown) {
      setErroServidor(
        err instanceof Error ? err.message : "Erro inesperado. Tente novamente."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Marque sua Consulta</h1>
        <p className="instrucao-form">
          Preencha todos os campos abaixo e clique em{" "}
          <strong>&quot;Agendar Consulta&quot;</strong> para confirmar seu
          agendamento com o Dr. Arthur.
        </p>

        {confirmado && (
          <div className="confirmacao-box" role="alert">
            ✅ Consulta agendada com sucesso!
            <br />
            Em breve entraremos em contato.
            <button
              className="confirmacao-fechar"
              onClick={() => setConfirmado(false)}
            >
              Fechar
            </button>
          </div>
        )}

        {erroServidor && (
          <div className="erro-msg" role="alert" style={{ marginBottom: "1rem" }}>
            ❌ {erroServidor}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo:</label>
            <input
              type="text"
              id="nome"
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              placeholder="Digite seu nome completo"
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="idade">Idade:</label>
            <input
              type="number"
              id="idade"
              value={form.idade}
              onChange={(e) => setForm((f) => ({ ...f, idade: e.target.value }))}
              placeholder="Digite sua idade"
              min={1}
              max={120}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefone">Telefone:</label>
            <input
              type="tel"
              id="telefone"
              value={form.telefone}
              onChange={(e) => handleTelefone(e.target.value)}
              onKeyDown={handleTelefoneKeyDown}
              placeholder="(24) 99999-9999"
              autoComplete="tel"
              maxLength={15}
              required
            />
            {erroTelefone && (
              <span className="erro-msg" role="alert">
                ⚠️ Digite um número com 11 dígitos. Exemplo: (24) 99999-9999
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="data">Data da Consulta:</label>
            <input
              type="date"
              id="data"
              value={form.data}
              onChange={(e) => handleDataChange(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="horario">Horário:</label>
            <select
              id="horario"
              value={form.horario}
              onChange={(e) => setForm((f) => ({ ...f, horario: e.target.value }))}
              required
            >
              <option value="">
                {form.data ? "Selecione um horário" : "Escolha a data primeiro"}
              </option>
              {HORARIOS.map((h) => {
                const ocupado = form.data ? isOcupado(h) : false;
                return (
                  <option key={h} value={h} disabled={ocupado}>
                    {h}{ocupado ? " — Ocupado" : ""}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="motivo">Motivo da Consulta:</label>
            <select
              id="motivo"
              value={form.motivo}
              onChange={(e) => {
                setForm((f) => ({ ...f, motivo: e.target.value }));
                setErroMotivo(false);
              }}
              style={
                erroMotivo
                  ? { borderColor: "#fcd34d", boxShadow: "0 0 0 3px rgba(252,211,77,0.4)" }
                  : {}
              }
              required
            >
              <option value="">Selecione o motivo</option>
              <option value="consulta-geral">Consulta Geral</option>
              <option value="retorno">Retorno</option>
              <option value="exame">Resultado de Exame</option>
              <option value="outro">Outro</option>
            </select>
            {erroMotivo && (
              <span className="erro-msg" role="alert">
                ⚠️ Selecione o motivo da consulta.
              </span>
            )}
          </div>

          <button type="submit" className="cta-button" disabled={enviando}>
            {enviando ? "Aguarde..." : "📅 Agendar Consulta"}
          </button>
        </form>

        <div className="contatos-section">
          <h2>Contatos do Consultório</h2>
          <ul className="contatos-list">
            <li>
              📱 <strong>Celular:</strong>{" "}
              <a href="tel:+5524999137130">(24) 99913-7130</a>
            </li>
            <li>
              💬 <strong>WhatsApp:</strong>{" "}
              <a href="https://wa.me/5524991372230" target="_blank" rel="noopener noreferrer">
                (24) 99137-2230
              </a>
            </li>
            <li>
              ☎️ <strong>Fixo:</strong>{" "}
              <a href="tel:+552424892311">(24) 2489-2311</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
