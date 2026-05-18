import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marque sua Consulta | Dr. Arthur",
  description:
    "Plataforma de agendamento de consultas médicas com o Dr. Arthur. Simples, prático e acessível.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
