import React, { useState } from 'react';
import { CreditCard, QrCode, FileText, HelpCircle, Plus, Minus, ShieldCheck, Headphones } from 'lucide-react';

export default function PaymentMethods() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqItems = [
    {
      question: "Recebi um e-mail informando que meu pedido está pendente. O pagamento não foi aprovado?",
      answer: "Após a conclusão do pagamento, pode levar até 2 dias úteis para a confirmação. Durante esse período, você receberá um e-mail de confirmação ou poderá acompanhar o status do pedido em Meus Pedidos. Se já se passaram mais de 2 dias úteis e o pagamento foi feito no cartão de crédito, recomendamos que entre em contato com a administradora do seu cartão para verificar o motivo da não aprovação."
    },
    {
      question: "Posso alterar a forma de pagamento após finalizar o pedido?",
      answer: "Atualmente, não é possível alterar a forma de pagamento depois que o pedido foi concluído."
    },
    {
      question: "Posso pagar com dois cartões de crédito?",
      answer: "Sim, mas somente através dos nossos canais de atendimento."
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-[900px] mx-auto px-6">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-xs font-black uppercase tracking-widest">
            <ShieldCheck className="size-4" /> Pagamento Seguro
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
            Formas de Pagamento
          </h1>
          <p className="text-slate-500 font-medium">
            Oferecemos opções de pagamento rápidas, seguras e práticas para você finalizar sua compra com tranquilidade.
          </p>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Pix */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="space-y-4">
              <div className="size-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <QrCode className="size-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Pix</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Realize pagamentos instantâneos a qualquer hora e dia da semana. Com o Pix, sua compra é aprovada em tempo real, garantindo rapidez e segurança.
              </p>
            </div>
            <div className="pt-6 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 py-2 rounded-xl text-center mt-4">
              Aprovação Instantânea
            </div>
          </div>

          {/* Credit Card */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="space-y-4">
              <div className="size-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="size-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Cartão de Crédito</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Parcelamos sua compra em até 12 vezes. Aceitamos as bandeiras Visa, MasterCard, American Express, Elo e Hipercard. Para a sua segurança, poderemos entrar em contato para confirmar informações.
              </p>
            </div>
            <div className="pt-6 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 py-2 rounded-xl text-center mt-4">
              Em até 12x Sem Juros
            </div>
          </div>

          {/* Boleto */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="space-y-4">
              <div className="size-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="size-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Boleto Bancário</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Caso opte pelo pagamento via boleto, lembre-se de que a compensação bancária pode levar até 3 dias úteis.
              </p>
            </div>
            <div className="pt-6 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 py-2 rounded-xl text-center mt-4">
              Até 3 dias úteis
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm space-y-8">
          <div className="flex items-center gap-3 text-slate-900">
            <HelpCircle className="size-6 text-primary" />
            <h2 className="text-2xl font-black uppercase tracking-tight">Dúvidas Frequentes</h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className={`border rounded-2xl transition-all duration-300 ${
                  openFaq === index 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left group"
                >
                  <span className={`text-base font-bold transition-colors ${openFaq === index ? 'text-primary' : 'text-slate-800'}`}>
                    {item.question}
                  </span>
                  <div className={`size-7 rounded-full flex items-center justify-center transition-all ${
                    openFaq === index ? 'bg-primary text-white rotate-180' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}>
                    {openFaq === index ? <Minus className="size-4" /> : <Plus className="size-4" />}
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === index ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed font-medium">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="mt-8 bg-slate-900 text-white p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center">
          <div className="flex items-center gap-2">
            <Headphones className="size-4 text-primary" />
            <span>Precisa de dois cartões? Fale nos canais de atendimento</span>
          </div>
          <div className="text-slate-500">
            Segunda à Sexta, das 9h às 17h
          </div>
        </div>

      </div>
    </main>
  );
}
