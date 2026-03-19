import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-12 px-6 bg-white mt-auto">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="flex flex-col gap-4">
          <Link to="/" className="inline-block">
            <img src="/logo.png" alt="Hydravive" className="h-24 w-auto" />
          </Link>
          <p className="text-sm text-slate-500">Água pura, lucro puro. Junte-se ao movimento global por tecnologia de hidratação sustentável.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Programa</h4>
          <ul className="flex flex-col gap-2 text-sm text-slate-500">
            <li><Link to="#" className="hover:text-primary transition-colors">Guia de Comissões</Link></li>
            <li><Link to="#" className="hover:text-primary transition-colors">Histórias de Sucesso</Link></li>
            <li><Link to="#" className="hover:text-primary transition-colors">Kit de Marketing</Link></li>
            <li><Link to="#" className="hover:text-primary transition-colors">Eventos e Retiros</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Suporte</h4>
          <ul className="flex flex-col gap-2 text-sm text-slate-500">
            <li><Link to="#" className="hover:text-primary transition-colors">Central de Ajuda</Link></li>
            <li><Link to="#" className="hover:text-primary transition-colors">Termos de Afiliado</Link></li>
            <li><Link to="#" className="hover:text-primary transition-colors">Política de Privacidade</Link></li>
            <li><Link to="#" className="hover:text-primary transition-colors">Contatar Suporte</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Confiança</h4>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="material-symbols-outlined">lock</span>
            <span className="material-symbols-outlined">eco</span>
            <span className="material-symbols-outlined">public</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-6">© 2026 Loja Hydravive. Todos os direitos reservados. Desenvolvido por P4D Mídia</p>
        </div>
      </div>
    </footer>
  );
}
