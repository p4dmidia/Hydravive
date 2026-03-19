import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight mb-2">Bem-vindo de Volta</h1>
          <p className="text-slate-500">Faça login no seu Escritório Virtual</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-slate-500">Endereço de E-mail</label>
            <input 
              required
              className="bg-slate-50 border-transparent focus:border-primary focus:ring-primary rounded-xl p-4 transition-all" 
              placeholder="nome@exemplo.com" 
              type="email" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-slate-500">Senha</label>
            <input 
              required
              className="bg-slate-50 border-transparent focus:border-primary focus:ring-primary rounded-xl p-4 transition-all" 
              placeholder="••••••••" 
              type="password" 
            />
          </div>
          
          <div className="flex items-center justify-between text-sm mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-primary focus:ring-primary" />
              <span className="text-slate-600">Lembrar de mim</span>
            </label>
            <Link to="#" className="text-primary font-bold hover:underline">Esqueceu a senha?</Link>
          </div>

          <button className="bg-primary text-white py-4 rounded-xl font-bold mt-4 hover:shadow-xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20" type="submit">
            Entrar no Painel
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-slate-500">
            Ainda não é um embaixador?{' '}
            <Link to="/affiliate" className="text-primary font-bold hover:underline">Saiba mais aqui</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
