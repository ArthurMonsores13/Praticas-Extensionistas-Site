"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ showTitle }: { showTitle?: boolean }) {
  const pathname = usePathname();

  return (
    <header>
      {showTitle && (
        <div id="title">
          <h1>Marque sua Consulta</h1>
        </div>
      )}
      <nav>
        <ul>
          <li>
            <Link href="/" className={pathname === "/" ? "active" : ""}>
              Início
            </Link>
          </li>
          <li>
            <Link
              href="/sobre"
              className={pathname === "/sobre" ? "active" : ""}
            >
              Sobre
            </Link>
          </li>
          <li>
            <Link
              href="/agendar"
              className={pathname === "/agendar" ? "active" : ""}
            >
              Agende Sua Consulta
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
