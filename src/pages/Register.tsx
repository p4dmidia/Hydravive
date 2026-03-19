import React from 'react';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight mb-2">Criar Conta</h1>
          <p className="text-slate-500">Junte-se à comunidade Hydravive</p>
        </div>
        
        <form className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-slate-500">Primeiro Nome</label>
              <input className="bg-background-light border-transparent focus:border-primary focus:ring-primary rounded-xl p-4" placeholder="João" type="text" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-slate-500">Sobrenome</label>
              <input className="bg-background-light border-transparent focus:border-primary focus:ring-primary rounded-xl p-4" placeholder="Silva" type="text" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-slate-500">Endereço de E-mail</label>
            <input className="bg-background-light border-transparent focus:border-primary focus:ring-primary rounded-xl p-4" placeholder="nome@exemplo.com" type="email" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-slate-500">Senha</label>
            <input className="bg-background-light border-transparent focus:border-primary focus:ring-primary rounded-xl p-4" placeholder="••••••••" type="password" />
          </div>
          
          <p className="text-[10px] text-slate-400 text-center mt-2">
            Ao se cadastrar, você concorda com nossos Termos de Serviço e Política de Privacidade.
          </p>

          <button className="bg-primary text-white py-4 rounded-xl font-bold mt-4 hover:shadow-xl transition-all" type="submit">
            Criar Conta
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-slate-500">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
