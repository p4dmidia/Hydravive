import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Droplet, 
  Clock, 
  Target, 
  Compass, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Scale, 
  ThumbsUp, 
  Award,
  ArrowRight
} from 'lucide-react';

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-slate-50 pt-20">
      {/* Hero Section */}
      <section className="relative px-6 py-24 lg:py-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/25 via-slate-900/50 to-slate-900 z-0"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/4 z-0"></div>
        
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-xs font-black uppercase tracking-widest animate-pulse">
              <Droplet className="size-4 fill-primary" /> Sobre a HydraVive
            </div>
            <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tight leading-none text-white">
              Uma maneira melhor <br />
              <span className="text-primary bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">de viver</span>
            </h1>
            <p className="text-slate-300 text-lg lg:text-xl font-medium leading-relaxed">
              Água é vida, e a vida merece ser mais pura. Desde o início, nossa missão tem sido oferecer soluções eficazes e acessíveis para garantir água de qualidade, pois sabemos que a hidratação adequada é essencial para a saúde e o bem-estar. Em um mundo onde a pureza da água é uma preocupação crescente, buscamos inovar continuamente para tornar a água mais segura, saudável e acessível a todos.
            </p>
          </div>
        </div>
      </section>

      {/* Trajectory Section */}
      <section className="py-20 lg:py-28 px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-full text-slate-600 text-xs font-bold uppercase tracking-widest">
              <Clock className="size-4" /> Nossa Trajetória
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight">
              Mais de 20 anos transformando vidas
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium text-base">
              Com mais de 20 anos de experiência no segmento de purificadores de água, nos consolidamos como uma empresa que vai além de simplesmente vender produtos. Nossa verdadeira missão é transformar a maneira como as pessoas consomem água, proporcionando mais qualidade de vida e bem-estar. Ao longo dos anos, conquistamos a confiança de nossos clientes ao oferecer purificadores que atendem aos mais altos padrões de qualidade e eficiência, sem abrir mão da acessibilidade.
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full"></div>
            <div className="relative bg-slate-900 text-white p-8 lg:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col gap-6">
              <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-white">
                <Sparkles className="size-6" />
              </div>
              <h3 className="text-xl font-black uppercase text-primary tracking-wide">
                Novo Lançamento: Squeeze Purificador
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed font-medium">
                Agora, damos um novo passo em nossa jornada com o lançamento da Squeeze Purificador HydraVive, nosso primeiro produto de fabricação própria. Com tecnologia inovadora, essa Squeeze não apenas alcaliniza a água, mas também libera minerais essenciais por meio de nanotecnologia, proporcionando uma hidratação mais eficiente e equilibrada. Criamos a Hydravive para levar saúde e praticidade para onde você estiver, permitindo que mais pessoas tenham acesso à água de alta qualidade a qualquer momento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-slate-950 text-white py-20 lg:py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-950 to-primary/10 z-0"></div>
        
        <div className="max-w-[1200px] mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Mission */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-10 lg:p-12 rounded-[2.5rem] hover:border-primary/30 transition-all flex flex-col justify-between group">
            <div className="space-y-6">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <Target className="size-8" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white">Nossa Missão</h3>
              <p className="text-slate-300 leading-relaxed font-medium text-sm lg:text-base">
                Fornecer soluções que elevam a qualidade da água, impactando positivamente a vida de nossos clientes. Além de oferecer purificadores e a Squeeze Hydravive, buscamos promover um modelo sustentável, gerando oportunidades de independência financeira e benefícios aos nossos parceiros e investidores.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-10 lg:p-12 rounded-[2.5rem] hover:border-blue-400/30 transition-all flex flex-col justify-between group">
            <div className="space-y-6">
              <div className="size-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <Compass className="size-8" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-white">Nossa Visão</h3>
              <p className="text-slate-300 leading-relaxed font-medium text-sm lg:text-base">
                Queremos ser referência global em soluções para água de qualidade, expandindo nossa presença e levando inovação para mais pessoas. Acreditamos que, ao unir tecnologia, acessibilidade e compromisso com o bem-estar, podemos revolucionar a forma como a água é consumida em lares e empresas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28 px-6 max-w-[1200px] mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-primary font-black uppercase tracking-widest text-xs">Os Pilares que nos Guiam</span>
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight">Nossos Valores</h2>
          <p className="text-slate-500 font-medium">Buscamos os mais altos padrões de excelência com ética, respeito e transparência.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: ShieldCheck,
              title: 'Ética',
              desc: 'Agimos com transparência, respeito e responsabilidade em todas as nossas relações.',
              color: 'text-emerald-500',
              bgColor: 'bg-emerald-50'
            },
            {
              icon: ThumbsUp,
              title: 'Honestidade',
              desc: 'Oferecemos produtos e serviços com total veracidade, prezando pela confiança de nossos clientes.',
              color: 'text-amber-500',
              bgColor: 'bg-amber-50'
            },
            {
              icon: Award,
              title: 'Qualidade',
              desc: 'Investimos constantemente em tecnologia e inovação para garantir desempenho e durabilidade superiores.',
              color: 'text-primary',
              bgColor: 'bg-primary/5'
            },
            {
              icon: Scale,
              title: 'Integridade',
              desc: 'Mantemos um alto padrão de conduta, alinhado com justiça e respeito aos nossos clientes e parceiros.',
              color: 'text-purple-500',
              bgColor: 'bg-purple-50'
            }
          ].map((val, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className={`size-14 rounded-2xl ${val.bgColor} ${val.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <val.icon className="size-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase mb-3">{val.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA / Final Section */}
      <section className="px-6 pb-24 lg:pb-32">
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] py-16 px-8 lg:p-20 flex flex-col items-center text-center gap-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent"></div>
          
          <div className="flex flex-col gap-6 relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight leading-tight">
              Estamos aqui para <br />
              <span className="text-primary bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">transformar vidas, uma gota por vez!</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              Com um olhar voltado para o futuro, seguimos comprometidos em oferecer água de qualidade.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <Link to="/shop" className="bg-primary text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
              Conhecer Nossos Produtos <ArrowRight className="size-4" />
            </Link>
            <a href="https://wa.me/556296390724" target="_blank" rel="noopener noreferrer" className="bg-white/10 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all">
              Falar com Consultor
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
