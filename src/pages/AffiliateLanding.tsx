import React from 'react';
import { ArrowRight as ArrowIcon, CreditCard, Calendar, ShieldCheck, CheckCircle2, Zap, Rocket as RocketIcon, Headset } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AffiliateLanding() {
  return (
    <main className="max-w-[1200px] mx-auto">
      {/* Hero Section */}
      <section className="px-6 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            <div className="flex flex-col gap-4">
              <span className="text-primary font-bold tracking-widest uppercase text-xs">Parceria com Excelência</span>
              <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                Junte-se ao Hydravive Elite: Transforme Pureza em Lucro
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                Capacitando empreendedores como você a aumentar sua renda enquanto promove tecnologia premium de purificação de água. Comece sua jornada rumo à riqueza sustentável.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="bg-primary text-white px-8 py-4 rounded-xl text-base font-bold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2">
                Comece a Ganhar Agora <ArrowIcon className="size-5" />
              </Link>
              <a href="#benefits" className="bg-white border border-slate-200 px-8 py-4 rounded-xl text-base font-bold hover:bg-slate-50 transition-all">
                Ver Benefícios
              </a>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="aspect-square rounded-3xl bg-cover bg-center shadow-2xl relative z-10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA6GRTDwUikHQUUVNR6aFASo6GS4a9ywcWBfaxKPHbCzNDLu5NPsaHxw2VTG3rEU5tRxeuHCREcdXt8F_rYhoH6-ZOSN32hQZPndJVTBtgOEgW_J724m4YuuOvInsIxnk-yokTb8qmu028-vp4FXfvC2RtbR_8xg6VyMAC7QaG4nHOAmGMLAe23V_Q2LDHPe5vka-_sl-9een9ogVcYHBB9yLda9mane5qWLo9WXI40iFWPKy46qYif27yKvQqGxjWpmyba7ks7FYM")' }}>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 border border-slate-100 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <CreditCard className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-bold">R$ 21.250,00</p>
                  <p className="text-xs text-slate-500">Comissão Mensal Média</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="px-6 py-20 bg-slate-50 rounded-[3rem] mx-4 mb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight text-slate-900">
            A tecnologia da <span className="text-primary">Hidratação Perfeita</span>
          </h2>
          <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
            <p>
              Enquanto todos competem vendendo os mesmos produtos de sempre, milhões de pessoas buscam algo que realmente funcione. Elas sabem que a água comum não é suficiente, mas ainda não encontraram a solução definitiva.
            </p>
            <p>
              Elas gastam fortunas com suplementos, dietas e produtos que prometem energia e vitalidade, sem atacar a base de tudo: a qualidade da água que bebem.
            </p>
            <p className="font-bold text-slate-900">
              É aqui que você entra. Não como mais um vendedor, mas como um consultor de saúde, apresentando uma tecnologia que ninguém mais tem.
            </p>
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section className="px-6 py-20 mb-20" id="program">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-primary font-bold uppercase tracking-widest text-sm">Oportunidade de Negócio</span>
              <h2 className="text-3xl md:text-5xl font-black leading-tight text-slate-900">
                O Programa de afiliação HYDRAVIVE
              </h2>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                Nós não criamos apenas um programa de afiliados. Criamos uma parceria de negócios para quem deseja estar na vanguarda do bem-estar.
              </p>
              <p>
                É a sua chance de ter um negócio próprio, com um produto de altíssima tecnologia e demanda crescente, sem precisar se preocupar com logística, estoque ou desenvolvimento de produto. Nós cuidamos de tudo isso. Você foca em conectar, transformar vidas e ser recompensado por isso.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-primary text-white shadow-2xl shadow-primary/20">
              <p className="text-lg mb-2 opacity-90">Seu acesso a este negócio transformador começa com um investimento estratégico de:</p>
              <div className="text-4xl md:text-5xl font-black mb-4">R$ 1.680,00</div>
              <p className="text-sm border-t border-white/20 pt-4">Mas veja o que você recebe imediatamente:</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-primary/20 hover:shadow-xl transition-all">
              <div className="flex gap-4 items-start">
                <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Zap className="size-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900 mb-1">1 Garrafa Purificadora HYDRAVIVE</h4>
                  <p className="text-sm text-slate-500 mb-2 font-medium">(Valor de Mercado: R$ 1.180,00)</p>
                  <p className="text-slate-600 text-sm">Sua principal ferramenta de vendas é a sua própria história. Use, sinta a diferença e deixe que seus resultados falem por si. Seu investimento já retorna em produto!</p>
                </div>
              </div>
            </div>

            <div className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-primary/20 hover:shadow-xl transition-all">
              <div className="flex gap-4 items-start">
                <div className="size-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <RocketIcon className="size-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900 mb-1">Seu Negócio Digital Completo</h4>
                  <p className="text-slate-600 text-sm">Receba seu link de vendas pessoal e um escritório virtual para gerenciar suas vendas, sua equipe e seus ganhos 24 horas por dia. É a sua loja online, pronta para faturar.</p>
                </div>
              </div>
            </div>

            <div className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-primary/20 hover:shadow-xl transition-all">
              <div className="flex gap-4 items-start">
                <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <CreditCard className="size-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900 mb-1">Poder de Compra Exclusivo</h4>
                  <p className="text-slate-600 text-sm">Adquira qualquer produto HYDRAVIVE com descontos especiais para consumo ou para potencializar suas demonstrações.</p>
                </div>
              </div>
            </div>

            <div className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-primary/20 hover:shadow-xl transition-all">
              <div className="flex gap-4 items-start">
                <div className="size-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Calendar className="size-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900 mb-1">Acesso a Treinamento de Elite</h4>
                  <p className="text-slate-600 text-sm">Participe de treinamentos ao vivo e gravados sobre o produto, técnicas de venda e estratégias de marketing digital para acelerar seus resultados.</p>
                </div>
              </div>
            </div>

            <div className="group p-6 rounded-2xl border border-slate-100 bg-white hover:border-primary/20 hover:shadow-xl transition-all">
              <div className="flex gap-4 items-start">
                <div className="size-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                  <Headset className="size-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900 mb-1">Suporte Dedicado</h4>
                  <p className="text-slate-600 text-sm">Você nunca estará sozinho. Conte com nossa equipe para tirar dúvidas e te apoiar em sua jornada de crescimento.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toolkit Preview */}
      <section className="px-6 py-20 bg-background-dark text-white rounded-[2rem] mx-4 mb-20 overflow-hidden relative" id="toolkit">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-5xl font-black leading-tight">Tudo o que você precisa para ter sucesso.</h2>
            <p className="text-slate-400 text-lg">Nós não te damos apenas um link. Nós te damos um negócio pronto. Acesse ativos de alta conversão instantaneamente.</p>
            <ul className="flex flex-col gap-4">
              {[
                'Fotografia de Estilo de Vida de Produto em 4K',
                'Scripts de e-mail de alta conversão comprovados',
                'Dashboard de vendas e CRM personalizado',
                'Suporte dedicado ao parceiro 24/7'
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-video bg-cover bg-center rounded-xl border border-white/10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD677n5aKEIh05cCimu4_AlhKfpDsQoDJFUIdawsboVmO9qZRlk2pBLrepmUP1V17BG4wctbQr_VTzW2MuVyaPEjH78iUBc95NpFgBUPIbtxiEZuUbQwsmLRlUH9lRDk-Rs6AgNm6VrmKppm2zXwRuhfFqfYdq-OKNmykeWxrnSoxYJH0A0tDFihDgiI0p5nsTWb2rpv-aqhGUfcHe1F3ZpuHH2kWnh2ffvzor5vQyxtYGf-30HpDKvphX9VPaR_5gilrZmI4Q4sk0')" }}></div>
            <div className="aspect-video bg-cover bg-center rounded-xl border border-white/10 translate-y-8" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOj194k0X-9Ji74YCTqAxdyNDJIdXFOmXGtugIwbr1J2twWftCa8e7RuMahaFLuDdT_625qQxwU0cKmH_JFEnkUTvjiBlu-FXk-5_TNVLJ9Y8bCjvfFFzzJgbsu4NArGnIgPgGTmLxhTwJuyyABfQO4-ddgofTp22Cd1Q-yXlnm9WzG0j7XCSua68VlC9Iz3xc6QWOg_ze_D94ZdAyXMEPThxCFU1Z2j6PXvwRUM9MveeSRJPEwplvQYZyUTeAAZsc9dLl-Ej2KtY')" }}></div>
            <div className="aspect-video bg-cover bg-center rounded-xl border border-white/10 -translate-y-4" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBv4GtfJitAOv_JUmiNnEjCWmA7834MDrTUE38ZFX3G18wgr-fwdFyJoSXeKUrKTmuty9-TNJF321uOBH0VUlYIHKAVjr1XmJ1UbKww0bb4rBtY4sbVIxmq6xoce_l5VIWTtWanv44zjXhPdHwnhQLfC3xmnjh5jB-mk_oYD5o0xBjZVTUc9eKPkdejsvqYV_74SGPJhWChptBhKyFgwyn7R9mCp-K4Ngjh37iGC3YBgRZ6bX3-uh8MA9DVi3TfR0D8BvmluDREiUA')" }}></div>
            <div className="aspect-video bg-cover bg-center rounded-xl border border-white/10 translate-y-4" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCI92Nd2wKgdcSewsXVPTCNmXbfQ7sSwj2AiSpS2ipPitnpsX8QuV1EV27PLmxfs9_78OLhIL6Jkx-bJtZeQBap3DHbBiK10g1lreiqvRkrVzTsW9pbGeNIzfH__Kg7s3YERI4qxmiOAEFuUcaaxPOqACbHiUv5BZWXqawLF2HaQvIZgNorjbciIJcNC6T7o-aLOsjNAFhs7AqKj0qltr9_CgPJ8-PnCvwV4GtGqYtjTzKWfYM478nIkqm-oyyiuhYL4x2DTkyNmW4')" }}></div>
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-8">
          <div className="size-24 mx-auto rounded-full bg-cover bg-center border-4 border-primary shadow-lg" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCV9WjMHKksyX6IEMHjAI5JiVYQ_d66l0mxvMbgitAU9tVUy53ghAOTTNidrRgc7q1WPtrE8lMkaxRvuGB2meVwkIKBBqb8y3YMLJV2F7AXrBkNoafYlutpYExLupwSzUqxmXAFBaFT1rxMDGCShRx7CScM6THE2Q4wg9nasZpY5lz8Ch5n6PQGfm5uVQGOs05BWELDsL5ZEgmYhVlgFFFVB49e3hb9tYUl7PCw95P5p_Bza6q9iUju_bolstn7FI0TtPC_hinCC7k')" }}></div>
          <blockquote className="text-2xl md:text-3xl font-medium italic leading-relaxed text-slate-700">
            "Entrar na Hydravive foi a melhor decisão que tomei para o meu negócio de consultoria. O produto se vende sozinho porque as pessoas se preocupam com a pureza, e a estrutura de comissões realmente recompensa meu trabalho duro."
          </blockquote>
          <div>
            <p className="font-black text-xl">Bruno K.</p>
            <p className="text-primary font-bold">Embaixador Platina desde 2022</p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="px-6 py-20 mb-20" id="register">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 overflow-hidden relative">
          <div className="flex flex-col gap-6 relative z-10">
            <h2 className="text-4xl font-black tracking-tight">Pronto para começar?</h2>
            <p className="text-slate-600 text-lg">
              Sua aprovação é imediata! Comece a lucrar agora mesmo.
            </p>
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-4">
                <Zap className="size-6 text-primary" />
                <span className="text-sm font-semibold">Aprovação imediata e automática</span>
              </div>
              <div className="flex items-center gap-4">
                <RocketIcon className="size-6 text-primary" />
                <span className="text-sm font-semibold">Acesso instantâneo ao treinamento</span>
              </div>
              <div className="flex items-center gap-4">
                <Headset className="size-6 text-primary" />
                <span className="text-sm font-semibold">Onboarding individual</span>
              </div>
            </div>
          </div>
          <form className="flex flex-col gap-4 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-500">Primeiro Nome</label>
                <input className="bg-background-light border-transparent focus:border-primary focus:ring-primary rounded-xl p-4" placeholder="Bruno" type="text" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-500">Sobrenome</label>
                <input className="bg-background-light border-transparent focus:border-primary focus:ring-primary rounded-xl p-4" placeholder="Silva" type="text" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-slate-500">Endereço de E-mail</label>
              <input className="bg-background-light border-transparent focus:border-primary focus:ring-primary rounded-xl p-4" placeholder="bruno@exemplo.com" type="email" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-500">WhatsApp</label>
                <input className="bg-background-light border-transparent focus:border-primary focus:ring-primary rounded-xl p-4" placeholder="(11) 99999-9999" type="tel" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-500">CPF ou CNPJ</label>
                <input className="bg-background-light border-transparent focus:border-primary focus:ring-primary rounded-xl p-4" placeholder="000.000.000-00" type="text" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-slate-500">Chave PIX (E-mail, CPF ou Celular)</label>
              <input className="bg-background-light border-transparent focus:border-primary focus:ring-primary rounded-xl p-4" placeholder="Sua chave PIX para recebimento" type="text" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-500">Cadastro de Senha</label>
                <input className="bg-background-light border-transparent focus:border-primary focus:ring-primary rounded-xl p-4" placeholder="••••••••" type="password" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-slate-500">Confirmação de Senha</label>
                <input className="bg-background-light border-transparent focus:border-primary focus:ring-primary rounded-xl p-4" placeholder="••••••••" type="password" />
              </div>
            </div>
            <button className="bg-primary text-white py-4 rounded-xl font-bold mt-4 hover:shadow-xl transition-all" type="submit">Enviar Inscrição</button>
            <p className="text-[10px] text-center text-slate-400 mt-2">Ao enviar, você concorda com nossos Termos de Embaixador e Política de Privacidade.</p>
          </form>
        </div>
      </section>
    </main>
  );
}
