import Link from "next/link";

export default function Footer() {


  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950/60 text-slate-400 text-sm">
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-emerald-500/80 text-xs font-bold text-emerald-400">
              +18
            </span>
            <div>
              <p className="font-semibold text-slate-200">CasinoRankBet</p>
              <p className="text-xs text-slate-400">
                Guías independientes de casinos online y bonos verificados.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs">
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              Inicio
            </Link>
            <a
              href="https://www.begambleaware.org/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="hover:text-emerald-400 transition-colors"
            >
              Juego Responsable
            </a>
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-800/80 pt-6 text-xs leading-relaxed text-slate-500">
          <p>
            <strong className="text-slate-400">Aviso de Juego Responsable (+18):</strong>{" "}
            El juego está estrictamente prohibido para menores de 18 años. Juega con
            responsabilidad y únicamente dinero que puedas permitirte perder. Si sientes
            que el juego está afectando tu vida, busca ayuda profesional.
          </p>
          <p>
            <strong className="text-slate-400">Transparencia de Afiliados:</strong>{" "}
            CasinoRankBet es un portal informativo independiente. Algunos enlaces hacia
            operadores pueden ser enlaces de afiliado; esto no supone ningún coste
            adicional para ti y nos ayuda a mantener las guías actualizadas.
          </p>
          <p className="pt-2 text-slate-600">
            © 2026 CasinoRankBet. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}