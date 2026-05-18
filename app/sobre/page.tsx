import Image from "next/image";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sobre - Dr. Arthur",
  description:
    "Conheça o Dr. Arthur e nossa equipe médica especializada em atendimento de qualidade.",
};

export default function Sobre() {
  return (
    <>
      <Header />
      <main className="sobre-main">
        <section>
          <h1>Sobre o Dr. Arthur | CRM: 2301214</h1>
          <p>
            Dr. Arthur é um profissional experiente e dedicado, comprometido em
            oferecer atendimento médico de excelência. Com anos de experiência
            na área da saúde, ele se especializou em proporcionar cuidados
            personalizados e humanizados para cada paciente.
          </p>

          <h2>Nossa Missão</h2>
          <p>
            Facilitar o acesso aos cuidados médicos através de uma plataforma
            moderna e intuitiva, conectando pacientes e profissionais de saúde
            de forma eficiente e segura.
          </p>
        </section>

        <article>
          <Image
            src="/mocasentada.png"
            alt="Profissional de saúde em ambiente médico"
            id="img"
            width={500}
            height={500}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}
