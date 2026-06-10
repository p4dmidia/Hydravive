import React from 'react';
import { Truck, Calendar, RefreshCw, HelpCircle, MapPin, Mail, AlertTriangle } from 'lucide-react';

export default function DeliveryPolicy() {
  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-[800px] mx-auto px-6">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-xs font-black uppercase tracking-widest">
            <Truck className="size-4" /> Logística & Envio
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
            Política de Entrega
          </h1>
          <p className="text-slate-500 font-medium">
            Entenda nossas políticas e prazos para receber seu purificador de água Hydravive.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm space-y-10 text-slate-600 leading-relaxed font-medium">
          
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Truck className="size-5 text-primary" /> Preparação e Prazos
            </h2>
            <ul className="space-y-3 pl-2">
              <li className="flex gap-3 text-sm md:text-base">
                <span className="text-primary font-bold">•</span>
                <span>A preparação e entregas dos pedidos são realizadas de segunda-feira a sexta-feira, das 9h às 17h.</span>
              </li>
              <li className="flex gap-3 text-sm md:text-base">
                <span className="text-primary font-bold">•</span>
                <span>O prazo de entrega é contado a partir da confirmação do pagamento em dias úteis, ou seja, não inclui sábados, domingos e feriados.</span>
              </li>
              <li className="flex gap-3 text-sm md:text-base">
                <span className="text-primary font-bold">•</span>
                <span>Algumas entregas podem ocorrer aos sábados, domingos e feriados.</span>
              </li>
              <li className="flex gap-3 text-sm md:text-base">
                <span className="text-primary font-bold">•</span>
                <span>Após a confirmação do pagamento do seu purificador de água, o prazo para emissão da Nota Fiscal é de até 2 dias úteis.</span>
              </li>
            </ul>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <MapPin className="size-5 text-primary" /> Correios e Rastreamento
            </h2>
            <p className="text-sm md:text-base">
              No caso de envio via correios será feita até 3 tentativas de entrega no endereço indicado. As demais tentativas de entrega serão cobradas. É de responsabilidade do cliente fazer o acompanhamento do produto através do código rastreador que é encaminhado pelo e-mail que você informou na compra.
            </p>
          </div>

          <hr className="border-slate-100" />

          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <AlertTriangle className="size-5 text-primary" /> Alterações de Pedidos
            </h2>
            <p className="text-sm md:text-base">
              Após a finalização do pedido não é possível alterar a forma de entrega, solicitar adiantamento ou prioridade.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* CTA Box */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/4 h-full bg-primary/10 -skew-x-12 translate-x-1/4"></div>
            <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest relative z-10">
              <HelpCircle className="size-4" /> Dúvidas ou Problemas?
            </div>
            <p className="text-sm text-slate-300 relative z-10">
              Qualquer dúvida ou problema, envie-nos o mais rápido possível uma mensagem no WhatsApp para vermos se ainda há tempo de solucionar.
            </p>
            <div className="pt-2 relative z-10">
              <a 
                href="https://wa.me/556296390724" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex bg-primary text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
