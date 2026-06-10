import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-16 px-6 bg-white mt-auto">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 text-slate-600">
        
        {/* Column 1: Logo */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="inline-block">
            <img src="/logo.png" alt="Hydravive" className="h-24 w-auto" />
          </Link>
          <p className="text-sm text-slate-500 leading-relaxed">
            Água pura, lucro puro. Junte-se ao movimento global por tecnologia de hidratação sustentável.
          </p>
        </div>

        {/* Column 2: Acesso */}
        <div>
          <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">Acesso</h4>
          <ul className="flex flex-col gap-2 text-sm text-slate-500">
            <li><Link to="/login" className="hover:text-primary transition-colors">Entrar na Conta</Link></li>
            <li><Link to="/register" className="hover:text-primary transition-colors">Criar Nova Conta</Link></li>
            <li><Link to="/my-orders" className="hover:text-primary transition-colors">Meus Pedidos</Link></li>
            <li><Link to="/affiliate" className="hover:text-primary transition-colors">Seja um Afiliado</Link></li>
          </ul>
        </div>

        {/* Column 3: Institucional */}
        <div>
          <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">Institucional</h4>
          <ul className="flex flex-col gap-2 text-sm text-slate-500">
            <li><Link to="/sobre-nos" className="hover:text-primary transition-colors">Sobre a Hydravive</Link></li>
            <li><a href="/#faq" className="hover:text-primary transition-colors">Dúvidas Frequentes</a></li>
            <li><a href="/#contato" className="hover:text-primary transition-colors">Fale Conosco</a></li>
          </ul>
        </div>

        {/* Column 4: Suporte */}
        <div>
          <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">Suporte</h4>
          <ul className="flex flex-col gap-2 text-sm text-slate-500">
            <li><Link to="/politica-de-privacidade" className="hover:text-primary transition-colors">Política de Privacidade</Link></li>
            <li><a href="/#faq" className="hover:text-primary transition-colors">Dúvidas Frequentes</a></li>
            <li><Link to="/politica-de-entrega" className="hover:text-primary transition-colors">Política de Entrega</Link></li>
            <li><Link to="/trocas-e-devolucoes" className="hover:text-primary transition-colors">Trocas e devoluções</Link></li>
            <li><Link to="/formas-de-pagamento" className="hover:text-primary transition-colors">Formas de Pagamento</Link></li>
          </ul>
        </div>

        {/* Column 5: Atendimento */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider">Atendimento</h4>
          <div className="text-xs text-slate-500 space-y-3 font-medium leading-relaxed">
            <div>
              <p className="font-bold text-slate-900 text-sm">Hydravive Purificadores</p>
              <p>Cnpj: 48.686.826/0001-82</p>
            </div>
            <div>
              <p>Avenida Circular, 1192, Sala 76</p>
              <p>Centro Empresarial 1000</p>
              <p>Setor Pedro Ludovico</p>
              <p>Goiânia, Goiás</p>
              <p>Cep: 74.823-020</p>
            </div>
            <div>
              <p className="font-bold text-slate-800">Contatos:</p>
              <p>62-36394912</p>
              <p>62-996390724</p>
            </div>
            <div>
              <p className="font-bold text-slate-800">E-mail:</p>
              <a href="mailto:hydravive@icloud.com" className="hover:text-primary transition-colors">hydravive@icloud.com</a>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright Line */}
      <div className="max-w-[1200px] mx-auto mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
        <p>© 2026 Loja Hydravive. Todos os direitos reservados. Desenvolvido por P4D Mídia</p>
      </div>
    </footer>
  );
}
