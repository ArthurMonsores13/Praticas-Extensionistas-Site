import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header showTitle />
      <main>
        <aside>
          <h2>Marque Agora!</h2>
          <h2>com Dr. Arthur</h2>
          <p>
            Este site é um protótipo criado com o intuito de se tornar uma
            plataforma para o agendamento de consultas médicas de forma mais
            simples e prática.
          </p>
        </aside>

        <article>
          <Image
            src="/mocasentada.png"
            id="img"
            alt="Profissional de saúde"
            width={500}
            height={500}
          />
        </article>

        <div className="agenda">
          <Link href="/agendar">Agende sua consulta!!</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
