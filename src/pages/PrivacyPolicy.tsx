import React from 'react';
import { Shield, Eye, Lock, FileText, Info } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-[1000px] mx-auto px-6">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-xs font-black uppercase tracking-widest">
            <Shield className="size-4" /> Termos & Segurança
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
            Política de Privacidade
          </h1>
          <p className="text-slate-500 font-medium">
            Entenda como coletamos, protegemos e utilizamos as suas informações na Hydravive.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-16 shadow-sm space-y-12 text-slate-600 leading-relaxed font-medium">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <Eye className="size-6 text-primary" />
              <h2 className="text-2xl font-black uppercase tracking-tight">1. Coleta e Uso de Informações</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base">
              <p>
                A sua privacidade é importante para nós. É política da HydraVive respeitar a sua privacidade em relação a qualquer informação que possamos coletar no site <span className="font-bold text-slate-900">hydravive.com.br</span> que possuímos e operamos.
              </p>
              <p>
                Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
              </p>
              <p>
                Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
              </p>
              <p>
                Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
              </p>
              <p>
                O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidades.
              </p>
              <p>
                Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.
              </p>
              <p>
                O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato conosco.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-slate-900">
              <Lock className="size-6 text-primary" />
              <h2 className="text-2xl font-black uppercase tracking-tight">2. Política de Cookies Hydravive</h2>
            </div>

            <div className="space-y-4 text-sm md:text-base">
              <div>
                <h3 className="font-bold text-slate-900 mb-1">O que são cookies?</h3>
                <p>
                  Como é prática comum em quase todos os sites profissionais, este site usa cookies, que são pequenos arquivos baixados no seu computador, para melhorar sua experiência. Esta página descreve quais informações eles coletam, como as usamos e por que às vezes precisamos armazenar esses cookies. Também compartilharemos como você pode impedir que esses cookies sejam armazenados, no entanto, isso pode fazer o downgrade ou 'quebrar' certos elementos da funcionalidade do site.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-1">Como usamos os cookies?</h3>
                <p>
                  Utilizamos cookies por vários motivos, detalhados abaixo. Infelizmente, na maioria dos casos, não existem opções padrão do setor para desativar os cookies sem desativar completamente a funcionalidade e os recursos que eles adicionam a este site. É recomendável que você deixe todos os cookies se não tiver certeza se precisa ou não deles, caso sejam usados para fornecer um serviço que você usa.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-1">Desativar cookies</h3>
                <p>
                  Você pode impedir a configuração de cookies ajustando as configurações do seu navegador (consulte a Ajuda do navegador para saber como fazer isso). Esteja ciente de que a desativação de cookies afetará a funcionalidade deste e de muitos outros sites que você visita. A desativação de cookies geralmente resultará na desativação de determinadas funcionalidades e recursos deste site. Portanto, é recomendável que você não desative os cookies.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="font-black text-slate-900 uppercase text-lg tracking-tight">Cookies que definimos:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Cookies relacionados à conta",
                    desc: "Se você criar uma conta conosco, usamos cookies para o gerenciamento do processo de inscrição e administração geral. Esses cookies geralmente são excluídos quando você sair do sistema, porém, em alguns casos, eles poderão permanecer posteriormente para lembrar as preferências do seu site ao sair."
                  },
                  {
                    title: "Cookies relacionados ao login",
                    desc: "Utilizamos cookies quando você está logado, para que possamos lembrar dessa ação. Isso evita que você precise fazer login sempre que visitar uma nova página. Esses cookies são normalmente removidos ou limpos quando você efetua logout para garantir que você possa acessar apenas a recursos e áreas restritas ao efetuar login."
                  },
                  {
                    title: "Cookies relacionados a boletins por e-mail",
                    desc: "Este site oferece serviços de assinatura de boletim informativo ou e-mail e os cookies podem ser usados para lembrar se você já está registrado e se deve mostrar determinadas notificações válidas apenas para usuários inscritos / não inscritos."
                  },
                  {
                    title: "Pedidos processando cookies relacionados",
                    desc: "Este site oferece facilidades de comércio eletrônico ou pagamento e alguns cookies são essenciais para garantir que seu pedido seja lembrado entre as páginas, para que possamos processá-lo adequadamente."
                  },
                  {
                    title: "Cookies relacionados a pesquisas",
                    desc: "Periodicamente, oferecemos pesquisas e questionários para fornecer informações interessantes, ferramentas úteis ou para entender nossa base de usuários com mais precisão. Essas pesquisas podem usar cookies para lembrar quem já participou numa pesquisa ou para fornecer resultados precisos após a alteração das páginas."
                  },
                  {
                    title: "Cookies relacionados a formulários",
                    desc: "Quando você envia dados por meio de um formulário como os encontrados nas páginas de contacto ou nos formulários de comentários, os cookies podem ser configurados para lembrar os detalhes do usuário para correspondência futura."
                  },
                  {
                    title: "Cookies de preferências do site",
                    desc: "Para proporcionar uma ótima experiência neste site, fornecemos a funcionalidade para definir suas preferências de como esse site é executado quando você o usa. Para lembrar suas preferências, precisamos definir cookies para que essas informações possam ser chamadas sempre que você interagir com uma página for afetada por suas preferências."
                  }
                ].map((cookie, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 p-6 rounded-3xl space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">{cookie.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{cookie.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="font-black text-slate-900 uppercase text-lg tracking-tight">Cookies de Terceiros</h3>
              <div className="space-y-4 text-sm md:text-base">
                <p>
                  Em alguns casos especiais, também usamos cookies fornecidos por terceiros confiáveis. A seção a seguir detalha quais cookies de terceiros você pode encontrar através deste site.
                </p>
                <p>
                  Este site usa o Google Analytics, que é uma das soluções de análise mais difundidas e confiáveis da Web, para nos ajudar a entender como você usa o site e como podemos melhorar sua experiência. Esses cookies podem rastrear itens como quanto tempo você gasta no site e as páginas visitadas, para que possamos continuar produzindo conteúdo atraente.
                </p>
                <p>
                  Para mais informações sobre cookies do Google Analytics, consulte a página oficial do Google Analytics.
                </p>
                <p>
                  As análises de terceiros são usadas para rastrear e medir o uso deste site, para que possamos continuar produzindo conteúdo atrativo. Esses cookies podem rastrear itens como o tempo que você passa no site ou as páginas visitadas, o que nos ajuda a entender como podemos melhorar o site para você.
                </p>
                <p>
                  Periodicamente, testamos novos recursos e fazemos alterações subtis na maneira como o site se apresenta. Quando ainda estamos testando novos recursos, esses cookies podem ser usados para garantir que você receba uma experiência consistente enquanto estiver no site, enquanto entendemos quais otimizações os nossos usuários mais apreciam.
                </p>
                <p>
                  À medida que vendemos produtos, é importante entendermos as estatísticas sobre quantos visitantes de nosso site realmente compram e, portanto, esse é o tipo de dados que esses cookies rastrearam. Isso é importante para você, pois significa que podemos fazer previsões de negócios com precisão que nos permitem analisar nossos custos de publicidade e produtos para garantir o melhor preço possível.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <FileText className="size-6 text-primary" />
              <h2 className="text-2xl font-black uppercase tracking-tight">3. Compromisso do Usuário</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base">
              <p>
                O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o Acqua Purificadores oferece no site e com caráter enunciativo, mas não limitativo:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-500">
                <li>
                  <span className="font-bold text-slate-900">A)</span> Não se envolver em atividades que sejam ilegais ou contrárias à boa fé e à ordem pública;
                </li>
                <li>
                  <span className="font-bold text-slate-900">B)</span> Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, ou casas de apostas, jogos de sorte e azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;
                </li>
                <li>
                  <span className="font-bold text-slate-900">C)</span> Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) da Hydravive, de seus fornecedores ou terceiros, para introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas de hardware ou software que sejam capazes de causar danos anteriormente mencionados.
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <Info className="size-6 text-primary" />
              <h2 className="text-2xl font-black uppercase tracking-tight">Mais Informações</h2>
            </div>
            <div className="space-y-4 text-sm md:text-base">
              <p>
                Esperamos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site.
              </p>
              <div className="inline-block bg-slate-50 border border-slate-100 px-6 py-3 rounded-2xl text-xs font-bold text-slate-500 uppercase tracking-widest">
                Esta política é efetiva a partir de Outubro/2026.
              </div>
            </div>
          </section>

        </div>

      </div>
    </main>
  );
}
