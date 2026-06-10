import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Shield, Zap, CheckCircle2, Leaf, Heart, Plus, Minus, HelpCircle, Mail, Phone, User, Send, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Comercial',
    subject: '',
    message: ''
  });
  const [submittingContact, setSubmittingContact] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingContact(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/hydravive@icloud.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Nome: contactForm.name,
          Email: contactForm.email,
          Telefone: contactForm.phone,
          Departamento: contactForm.department,
          Assunto: contactForm.subject,
          Mensagem: contactForm.message,
          _subject: `Novo contato pelo site: ${contactForm.subject || 'Geral'}`
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Mensagem enviada com sucesso!");
        setContactForm({
          name: '',
          email: '',
          phone: '',
          department: 'Comercial',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(data.message || "Erro ao enviar mensagem.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao enviar sua mensagem. Tente novamente.");
    } finally {
      setSubmittingContact(false);
    }
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .limit(3);
        
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const faqItems = [
    {
      question: "Qual a principal diferença entre a squeeze e os outros filtros do mercado?",
      answer: "Enquanto a maioria dos filtros apenas reduz o cloro e outras impurezas, a tecnologia que a HYDRAVIVE traz é única no mundo comprovada cientificamente, a eliminar 100% do cloro e flúor. Possui 21 minerais. E um dos grandes diferencias está no seu ORP negativo (Potencial de Redução da Oxidação) - um indicador de forte ação oxidante, capaz de combater os radicais livres que aceleram o envelhecimento celular. Essa característica combinada com a presença de hidrogênio molecular, potencializa o poder de regeneração do corpo, ajudando na recuperação muscular, na clareza mental e na vitalidade geral com função antibacteriana e antiviral. Além disso, o consumo regular dessa água fortalece o sistema imunológico."
    },
    {
      question: "O investimento na Squeeze realmente vale a pena?",
      answer: "Absolutamente. Ao eliminar a compra constante de galões ou águas engarrafadas, o valor do produto se paga em poucos meses. Você economiza dinheiro, ganha muito mais saúde e ainda ajuda a reduzir o lixo plástico no planeta."
    },
    {
      question: "Como eu sei a hora certa de trocar o refil?",
      answer: "É muito simples. Cada refil foi projetado para durar até 1.000 litros de água ou 12 meses de uso, o que vier primeiro. Para uma pessoa que consome em média 3 litros por dia, isso significa um ano inteiro de água pura e saudável com uma única troca."
    },
    {
      question: "Os produtos possuem garantia?",
      answer: "Sim. Todos os produtos que a HYDRAVIVE representa, possuem garantia de fábrica contra defeitos de fabricação. Nosso compromisso é com a sua total satisfação e confiança em nossa tecnologia."
    },
    {
      question: "O que a Squeeze Hydravive faz?",
      answer: "A Squeeze Hydravive transforma a água comum em água alcalina, ajudando a equilibrar o pH do corpo e proporcionando mais hidratação e bem-estar."
    },
    {
      question: "Como a Squeeze alcaliniza a água?",
      answer: "Ela contém um filtro com minerais especiais que elevam o pH da água, tornando-a mais leve e benéfica para a saúde."
    },
    {
      question: "Quanto tempo leva para a água ficar alcalina?",
      answer: "Basta encher a garrafa e aguardar de 2 a 5 minutos para obter água alcalina de qualidade."
    },
    {
      question: "A Squeeze altera o sabor da água?",
      answer: "Sim! Muitas pessoas relatam que a água fica mais leve e agradável de beber."
    },
    {
      question: "Quais os benefícios da água alcalina?",
      answer: "A água alcalina pode ajudar na hidratação, na eliminação de toxinas, no equilíbrio do pH do organismo e até na melhora da digestão e disposição."
    },
    {
      question: "Quem pode usar a Squeeze Hydravive?",
      answer: "Qualquer pessoa pode se beneficiar da água alcalina, desde crianças até idosos, incluindo atletas e pessoas que buscam mais saúde e bem-estar."
    },
    {
      question: "Grávidas e crianças podem consumir água alcalina?",
      answer: "Sim, mas recomendamos sempre consultar um profissional de saúde para orientações específicas."
    }
  ];
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-white text-slate-900 border-b border-slate-100">
        <div className="absolute top-0 right-0 w-1/2 h-full z-0 hidden lg:block">
          <img 
            src="/hero-bg.png" 
            alt="Water Purifier" 
            className="w-full h-full object-contain p-20"
          />
        </div>
        <div className="absolute inset-0 lg:hidden opacity-10">
          <img 
            src="/hero-bg.png" 
            alt="Water Purifier" 
            className="w-full h-full object-contain p-10"
          />
        </div>
        
        <div className="max-w-[1200px] mx-auto px-6 relative z-10 w-full py-20 lg:py-0">
          <div className="max-w-2xl flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-primary font-black tracking-widest uppercase text-[10px] md:text-sm">Hidratação de Próxima Geração</span>
              <h1 className="text-4xl md:text-7xl font-black leading-tight tracking-tight text-slate-900">
                Água Pura. <br />
                <span className="text-primary">Redefinida.</span>
              </h1>
              <p className="text-base md:text-lg text-slate-500 leading-relaxed font-medium max-w-lg">
                Experimente o sistema de purificação de água mais avançado do mundo. 
                99,9% de pureza, desperdício zero e um design que complementa seu estilo de vida.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="bg-primary text-white px-8 py-4 rounded-xl text-sm md:text-base font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 active:scale-95">
                Ver Loja <ArrowRight className="size-5" />
              </Link>
              <Link to="/affiliate" className="bg-slate-900 text-white px-8 py-4 rounded-xl text-sm md:text-base font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center active:scale-95">
                Seja um Afiliado
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-[1200px] mx-auto px-6 py-16 md:py-24 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black tracking-tight">Nossos Mais Vendidos</h2>
            <p className="text-slate-500">Os sistemas mais confiáveis para residências e escritórios.</p>
          </div>
          <Link to="/purifiers" className="text-primary font-bold flex items-center gap-2 hover:underline">
            Ver Todos os Produtos <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-4 bg-white rounded-2xl p-4 border border-slate-100">
                <div className="aspect-square rounded-xl bg-slate-100"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                <div className="h-4 bg-slate-100 rounded w-1/3"></div>
              </div>
            ))
          ) : products.map((product) => (
            <Link 
              key={product.id} 
              to={`/product/${product.id}`}
              className="group flex flex-col gap-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="aspect-square rounded-xl bg-slate-50 overflow-hidden relative">
                <img 
                  src={product.main_image_url || 'https://via.placeholder.com/400'} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 right-4 bg-white text-[#111618] p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                  <ArrowRight className="size-5" />
                </div>
              </div>
              <div className="flex flex-col gap-3 px-2">
                <div>
                  <h3 className="font-bold text-lg line-clamp-1 text-slate-900">{product.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mt-1">{product.description}</p>
                </div>
                <div className="w-full bg-primary/10 text-primary font-black uppercase tracking-widest text-[10px] py-3 rounded-xl flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white transition-all">
                  Saiba Mais <ArrowRight className="size-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2"></div>
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">Excelência HYDRAVIVE</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">O Compromisso <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">HYDRAVIVE</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="size-14 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="size-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Tecnologia Única no Mundo</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Somos a única marca com eficiência comprovada na eliminação de 100% do cloro e do flúor, garantindo uma pureza que você pode sentir.</p>
            </div>

            <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-400/20 hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="size-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="size-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Saúde em Primeiro Lugar</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Nossos produtos não apenas removem o que faz mal, mas enriquecem a água com hidrogênio molecular antioxidante e pH alcalino para mais vitalidade.</p>
            </div>

            <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-400/20 hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="size-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Leaf className="size-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Sustentabilidade Inteligente</h3>
              <p className="text-slate-600 leading-relaxed text-sm">Um único refil pode substituir milhares de garrafas plásticas. Beba água pura e ajude a proteger o planeta com inteligência e economia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 bg-slate-900 text-white">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 flex items-center justify-center gap-3">
              <HelpCircle className="text-primary size-10" />
              FAQ (Perguntas frequentes)
            </h2>
            <p className="text-slate-400 text-lg">Ainda tem dúvidas? Nós respondemos.</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className={`border rounded-2xl transition-all duration-300 ${
                  openFaq === index 
                    ? 'border-primary bg-white/5 shadow-lg shadow-primary/5' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <span className={`text-lg font-bold transition-colors ${openFaq === index ? 'text-primary' : 'text-white'}`}>
                    {item.question}
                  </span>
                  <div className={`size-8 rounded-full flex items-center justify-center transition-all ${
                    openFaq === index ? 'bg-primary text-white rotate-180' : 'bg-white/10 text-slate-400 group-hover:bg-white/20'
                  }`}>
                    {openFaq === index ? <Minus className="size-5" /> : <Plus className="size-5" />}
                  </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-8 pb-8 text-slate-400 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Droplets className="size-8" />
            </div>
            <h3 className="text-xl font-bold">Filtragem Ultra-Pura</h3>
            <p className="text-slate-500 text-sm">Remove 99,9% dos contaminantes, incluindo chumbo, cloro e microplásticos.</p>
          </div>
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Zap className="size-8" />
            </div>
            <h3 className="text-xl font-bold">Resultados Instantâneos</h3>
            <p className="text-slate-500 text-sm">A tecnologia de alto fluxo garante que você nunca precise esperar por um copo de água pura.</p>
          </div>
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Shield className="size-8" />
            </div>
            <h3 className="text-xl font-bold">Garantia Vitalícia</h3>
            <p className="text-slate-500 text-sm">Apoiamos nossa tecnologia com uma garantia vitalícia abrangente.</p>
          </div>
        </div>
      </section>

      {/* Fale Conosco */}
      <section id="contato" className="py-20 lg:py-28 bg-white border-t border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-primary/5 -skew-x-12 -translate-x-1/2"></div>
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="text-primary font-black uppercase tracking-widest text-xs">Atendimento</span>
                <h2 className="text-3xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight">Fale Conosco</h2>
                <p className="text-slate-500 font-medium text-base leading-relaxed">
                  Tem alguma dúvida, sugestão ou precisa de suporte? Entre em contato conosco preenchendo o formulário ao lado. Nosso time retornará o mais breve possível.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                  <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Mail className="size-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">E-mail</span>
                    <span className="block text-sm font-bold text-slate-900">hydravive@icloud.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                  <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Phone className="size-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">WhatsApp</span>
                    <span className="block text-sm font-bold text-slate-900">+55 (62) 9639-0724</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-100 p-8 lg:p-10 rounded-[2.5rem] shadow-sm">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500">Nome</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                        <User className="size-4" />
                      </span>
                      <input 
                        type="text" 
                        required
                        placeholder="Seu nome completo"
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* E-mail */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500">E-mail</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                        <Mail className="size-4" />
                      </span>
                      <input 
                        type="email" 
                        required
                        placeholder="seu.email@exemplo.com"
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Telefone */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500">Telefone</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                        <Phone className="size-4" />
                      </span>
                      <input 
                        type="tel" 
                        required
                        placeholder="(00) 00000-0000"
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Departamento */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500">Departamento</label>
                    <select 
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                      value={contactForm.department}
                      onChange={(e) => setContactForm({ ...contactForm, department: e.target.value })}
                    >
                      <option value="Comercial">Comercial</option>
                      <option value="Suporte Técnico">Suporte Técnico</option>
                      <option value="Parcerias / Afiliados">Parcerias / Afiliados</option>
                      <option value="Financeiro">Financeiro</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>

                {/* Assunto */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500">Assunto</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Assunto do contato"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary transition-colors"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  />
                </div>

                {/* Mensagem */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500">Mensagem</label>
                  <div className="relative">
                    <span className="absolute top-3 left-0 pl-4 text-slate-400">
                      <MessageSquare className="size-4" />
                    </span>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Escreva sua mensagem aqui..."
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary transition-colors resize-none"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submittingContact}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
                >
                  {submittingContact ? (
                    <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Entrar em contato <Send className="size-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
