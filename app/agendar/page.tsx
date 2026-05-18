import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgendamentoForm from "@/components/AgendamentoForm";

export const metadata: Metadata = {
  title: "Agendar Consulta | Dr. Arthur",
};

export default function Agendar() {
  return (
    <>
      <Header />
      <AgendamentoForm />
      <a
        href="https://wa.me/5524991372230"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        title="Fale pelo WhatsApp"
        aria-label="Abrir conversa no WhatsApp"
      >
        💬 WhatsApp
      </a>
      <Footer />
    </>
  );
}
