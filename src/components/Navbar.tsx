import React, { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import UserMenu from './UserMenu';

export default function Navbar() {
  const location = useLocation();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDashboard = location.pathname.startsWith('/dashboard');

  if (isDashboard) return null;

  const navLinks = [
    { label: 'Loja', path: '/shop' },
    { label: 'Purificadores', path: '/shop?category=Purificadores' },
    { label: 'Rastreie seu pedido', path: 'https://rastreamento.correios.com.br/app/index.php', external: true },
    { label: 'Afiliados', path: '/affiliate' },
  ];

  return (
    <header className="sticky top-0 z-[80] w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-6 h-20 md:h-28 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Hydravive" className="h-12 md:h-20 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {navLinks.map((link) => (
            link.external ? (
              <a 
                key={link.label}
                href={link.path} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition-colors uppercase text-[11px] font-black tracking-widest"
              >
                {link.label}
              </a>
            ) : (
              <Link 
                key={link.label} 
                to={link.path} 
                className="hover:text-primary transition-colors uppercase text-[11px] font-black tracking-widest"
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="flex items-center justify-center rounded-2xl h-10 w-10 md:h-12 md:w-12 bg-slate-50 text-[#111618] hover:bg-slate-100 transition-colors relative border border-slate-100 shadow-sm">
            <ShoppingCart className="size-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 size-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                {totalItems}
              </span>
            )}
          </Link>
          
          <UserMenu />

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center rounded-2xl h-10 w-10 bg-slate-900 text-white hover:bg-primary transition-all active:scale-95 shadow-lg shadow-slate-900/10"
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 top-20 z-[70] bg-white/95 backdrop-blur-lg transition-all duration-500 md:hidden overflow-y-auto ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
        <div className="p-10 flex flex-col gap-10">
          <nav className="flex flex-col gap-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Navegação</p>
            {navLinks.map((link) => (
              <div key={link.label} className="group border-b border-slate-100 pb-4">
                {link.external ? (
                  <a 
                    href={link.path} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-between text-xl font-black text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="size-5 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                  </a>
                ) : (
                  <Link 
                    to={link.path} 
                    className="flex items-center justify-between text-xl font-black text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="size-5 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Profile Actions */}
          <div className="bg-slate-50 rounded-[2rem] p-8 space-y-6">
            <h4 className="text-sm font-black text-slate-900 uppercase">Minha Conta</h4>
            <div className="grid grid-cols-1 gap-4">
              <Link 
                to="/cart" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 p-6 bg-white border border-slate-200 rounded-2xl group active:scale-95 transition-all shadow-sm"
              >
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <ShoppingCart className="size-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Finalizar</span>
                  <span className="block text-sm font-black uppercase tracking-tight text-slate-900">Meu Carrinho</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hydravive &copy; 2024</p>
          </div>
        </div>
      </div>
    </header>
  );
}
