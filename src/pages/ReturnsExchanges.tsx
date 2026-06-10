import React from 'react';
import { RefreshCw, FileText, AlertOctagon, CheckCircle, CreditCard, Clock, ShieldAlert, Mail, Phone } from 'lucide-react';

export default function ReturnsExchanges() {
  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-[900px] mx-auto px-6">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-xs font-black uppercase tracking-widest">
            <RefreshCw className="size-4 animate-spin-slow" /> Pós-Venda
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
            Trocas e Devoluções
          </h1>
          <p className="text-slate-500 font-medium">
            Entenda nossa política de troca e reembolso, em total conformidade com o Código de Defesa do Consumidor.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-16 shadow-sm space-y-12 text-slate-600 leading-relaxed font-medium">
          
          {/* Intro Section */}
          <section className="space-y-4">
            <p className="text-slate-700 text-base md:text-lg">
              A Hydravive deseja que você tenha total satisfação nas compras através do nosso site e, por isso, criou uma política de troca e devolução que respeita o Código de Defesa do Consumidor e protege o bem comum.
            </p>
            <p>
              Cuidamos de todos os detalhes para que seu purificador de água chegue em sua casa da melhor forma possível.
            </p>
            <div className="bg-amber-50 border border-amber-200/50 p-6 rounded-3xl text-sm flex gap-4 items-start text-amber-800">
              <ShieldAlert className="size-6 shrink-0 text-amber-600" />
              <div>
                <strong className="block text-amber-900 mb-1">Divergências na entrega?</strong>
                Caso você receba seu produto com divergências, como embalagem aberta ou danificada, falta de acessórios ou produto em desacordo com o adquirido, nos comunique imediatamente através do nosso e-mail: <a href="mailto:hydravive@icloud.com" className="underline font-bold text-amber-950">hydravive@icloud.com</a>, pois são casos excepcionais que serão analisados de forma individual e diversa das descritas a seguir.
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 1: Legislation */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <FileText className="size-6 text-primary" />
              <h2 className="text-2xl font-black uppercase tracking-tight">Direito de Arrependimento</h2>
            </div>
            <p>
              <strong className="text-slate-950">Legislação consumerista para o E-commerce:</strong> O Decreto nº 7.962/2013, que regulou o E-Commerce no Brasil, em seu artigo 1º, inciso III, reproduziu a regra do artigo 49 do Código de Defesa do Consumidor, que consiste em oferecer ao comprador o prazo de 07 (sete) dias para desistir da compra realizada de forma não presencial.
            </p>
            <p>
              Sendo assim, caso o produto que você escolheu não serviu, não satisfez ou rolou aquele arrependimento da compra antes mesmo da entrega, você tem o prazo de <strong className="text-slate-950">até 07 dias corridos</strong>, após o recebimento do produto, para solicitar a troca ou devolução pelo nosso e-mail, constando as seguintes informações:
            </p>
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl space-y-3 font-semibold text-slate-800">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-black mb-2">Dados necessários no e-mail:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Nome completo</li>
                <li>Endereço completo</li>
                <li>Número do pedido</li>
                <li>Motivo: Aqui você deve esclarecer o motivo (“o que houve?”) e, principalmente, o que você deseja obter (“é uma troca ou reembolso?”).</li>
              </ol>
            </div>
            <p className="text-sm font-semibold text-slate-500 italic">
              Feito o envio do seu e-mail, é hora do nosso retorno, constando a informação de endereço para devolução do produto e orientação dos próximos passos.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2: Instructions and Care */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <Clock className="size-6 text-primary" />
              <h2 className="text-2xl font-black uppercase tracking-tight">Instruções de Postagem</h2>
            </div>
            <div className="space-y-4">
              <p>
                <strong className="text-slate-950">Atenção ao Frete:</strong> O custo do frete para a primeira troca e devolução fica por conta da Hydravive. Caso você receba sua troca e queira trocar novamente, o novo frete fica por sua conta.
              </p>
              <p>
                Ao postar a mercadoria nos Correios, você deve enviar para nosso e-mail <a href="mailto:hydravive@icloud.com" className="underline font-bold text-slate-950">hydravive@icloud.com</a> uma foto do comprovante de pagamento dos Correios e seus dados bancários para fazermos o reembolso do frete. O reembolso será feito em até 2 (dois) dias úteis.
              </p>
              <p>
                Seu pedido deve ser devolvido em Correios registrado e com a embalagem bem lacrada, só serão aceitos para troca e devolução os produtos nas exatas condições de envio.
              </p>
              <p>
                A Hydravive não se responsabiliza por itens danificados ou perdidos durante o trânsito de retorno. Por isso, cuide dos produtos enquanto estiverem em sua posse.
              </p>
              <p>
                Além disso, os produtos devem ser devolvidos em sua embalagem original e acompanhada da nota fiscal, com aquelas mesmas informações do e-mail, só que agora manuscrita e assinada por você, no verso da nota fiscal:
              </p>
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-sm italic text-slate-600 font-bold text-center">
                "(1 - nome completo; 2 - endereço completo; 3 - número do pedido; 4 - motivo da troca (pode só resumir aqui!); 5 – assinatura)"
              </div>
              <p className="text-sm font-semibold text-slate-900 text-center">
                Feito! O produto chegou à nossa empresa.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3: Analysis Outcomes */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-slate-900">
              <RefreshCw className="size-6 text-primary" />
              <h2 className="text-2xl font-black uppercase tracking-tight">Análise de Qualidade</h2>
            </div>
            <p>
              O produto devolvido será analisado pelo nosso setor de controle de qualidade e a liberação poderá ocorrer no prazo de até 05 (cinco) dias úteis, após o recebimento. Você receberá um retorno via e-mail, informando em qual categoria sua solicitação se encaixou:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bad Outcome */}
              <div className="bg-red-50/50 border border-red-100 p-8 rounded-[2rem] flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-black uppercase">
                    <AlertOctagon className="size-4" /> “iiiihh! não deu!”
                  </div>
                  <p className="text-sm text-red-900/80 leading-relaxed font-semibold">
                    Identificamos que o produto foi utilizado, sofreu danos ou não foram cumpridas as políticas de trocas e devoluções aqui descritas. Nesse caso não aceitamos sua devolução e devolveremos o produto ao remetente.
                  </p>
                </div>
              </div>

              {/* Good Outcome */}
              <div className="bg-emerald-50/50 border border-emerald-100 p-8 rounded-[2rem] flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black uppercase">
                    <CheckCircle className="size-4" /> “ihul! eba! deu certo!”
                  </div>
                  <p className="text-sm text-emerald-900/80 leading-relaxed font-semibold">
                    O produto encontra-se nas exatas condições do dia de envio e respeitou todas as normas da nossa política de troca e devolução. Nesse caso a empresa decidirá pela troca ou reembolso, analisando cada caso. Após o recebimento, temos 5 dias úteis para analisar a troca ou reembolso.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 4: Reimbursment details */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-slate-900">
              <CreditCard className="size-6 text-primary" />
              <h2 className="text-2xl font-black uppercase tracking-tight">Formas de Reembolso</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <CreditCard className="size-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-sm tracking-wide">Estorno em Cartão</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Exclusivo para pedidos pagos em cartão de crédito. O prazo do estorno seguirá as regras da administradora do cartão. Poderá demorar de uma a duas faturas para constar o crédito, dependendo da data de vencimento de sua fatura.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <FileText className="size-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-sm tracking-wide">Reembolso em Conta Corrente</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Para pedidos pagos em boleto, o valor da compra poderá ser reembolsado em uma conta corrente, de mesma titularidade do responsável pelo pedido (CPF idêntico). O prazo do reembolso dependerá da informação correta dos dados e seguirá as regras do banco recebedor do crédito.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Final contact info */}
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400 text-center md:text-left">
            <div>
              Atendimento: Segunda à Sexta, das 9h às 17h
            </div>
            <div className="text-slate-500">
              Boas compras!
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
