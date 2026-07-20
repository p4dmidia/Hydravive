export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  affiliate_price: number;
  points_generated: number;
  points_cost: number;
  allow_points_redemption: boolean;
  rating: number;
  image: string;
  images?: string[];
  tags: string[];
  description: string;
  features: string[];
  max_installments?: number;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Purificador X1 Pro',
    category: 'Purificadores',
    price: 1399,
    affiliate_price: 980,
    points_generated: 140,
    points_cost: 2800,
    allow_points_redemption: true,
    rating: 5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMOayWLQFjHevLaBDG9dqt340yE4fhE4GwjAIS3vBJi25YFx210XprUPKkn35spWeV9WtHrKOw7MP0zE4exAuZYcMcnbmYadtn1Mhi5_pCQEhM47oEe83WMWT0Je-9_L93BNgx5CsX3jklbOB7qk5LZW1CN7feMmeCw5UYRGhCLW42_kpyKSFFHcVzy-iM8phC_-W5nuQWrqnRqumO0m1SCdlhc5egcC7nuI0ilh68e4ymp1n-OI_sLk970-cDcPtueqVwkjAQqjc',
    tags: ['Mais Vendido', 'Premium'],
    description: 'O Purificador X1 Pro é o nosso modelo mais avançado, utilizando tecnologia de filtragem de 7 estágios para garantir que cada gota seja perfeitamente pura e revitalizante.',
    features: ['Filtração de 7 Estágios', 'Tecnologia Mineralise+', 'Design Ultra Slim', 'Monitoramento Digital']
  },
  {
    id: 2,
    name: 'Garrafa HydraGo 750ml',
    category: 'Purificadores',
    price: 249,
    affiliate_price: 180,
    points_generated: 25,
    points_cost: 500,
    allow_points_redemption: true,
    rating: 4,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-6GRTDwUikHQUUVNR6aFASo6GS4a9ywcWBfaxKPHbCzNDLu5NPsaHxw2VTG3rEU5tRxeuHCREcdXt8F_rYhoH6-ZOSN32hQZPndJVTBtgOEgW_J724m4YuuOvInsIxnk-yokTb8qmu028-vp4FXfvC2RtbR_8xg6VyMAC7QaG4nHOAmGMLAe23V_Q2LDHPe5vka-_sl-9een9ogVcYHBB9yLda9mane5qWLo9WXI40iFWPKy46qYif27yKvQqGxjWpmyba7ks7FI0TtPC_hinCC7k',
    tags: ['Portátil'],
    description: 'Leve a pureza da Hydravive para qualquer lugar com a Garrafa HydraGo. Mantém a temperatura por 24h e possui filtro integrado.',
    features: ['Isolamento Térmico Duplo', 'Filtro Integrado', 'Livre de BPA', 'Aço Inoxidável 304']
  },
  {
    id: 3,
    name: 'Filtro de Reposição Ultra',
    category: 'Filtros',
    price: 189,
    affiliate_price: 130,
    points_generated: 20,
    points_cost: 400,
    allow_points_redemption: true,
    rating: 5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD677n5aKEIh05cCimu4_AlhKfpDsQoDJFUIdawsboVmO9qZRlk2pBLrepmUP1V17BG4wctbQr_VTzW2MuVyaPEjH78iUBc95NpFgBUPIbtxiEZuUbQwsmLRlUH9lRDk-Rs6AgNm6VrmKppm2zXwRuhfFqfYdq-OKNmykeWxrnSoxYJH0A0tDFihDgiI0p5nsTWb2rpv-aqhGUfcHe1F3ZpuHH2kWnh2ffvzor5vQyxtYGf-30HpDKvphX9VPaR_5gilrZmI4Q4sk0',
    tags: ['Essencial'],
    description: 'Mantenha seu sistema operando com 100% de eficiência. Recomendado a troca a cada 6 meses.',
    features: ['Certificação NSF', 'Bloqueio de Microplásticos', 'Carvão Ativado por Casca de Coco']
  },
  {
    id: 4,
    name: 'Adaptador de Torneira Smart',
    category: 'Filtros',
    price: 329,
    affiliate_price: 240,
    points_generated: 35,
    points_cost: 700,
    allow_points_redemption: true,
    rating: 4,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv4GtfJitAOv_JUmiNnEjCWmA7834MDrTUE38ZFX3G18wgr-fwdFyJoSXeKUrKTmuty9-TNJF321uOBH0VUlYIHKAVjr1XmJ1UbKww0bb4rBtY4sbVIxmq6xoce_l5VIWTtWanv44zjXhPdHwnhQLfC3xmnjh5jB-mk_oYD5o0xBjZVTUc9eKPkdejsvqYV_74SGPJhWChptBhKyFgwyn7R9mCp-K4Ngjh37iGC3YBgRZ6bX3-uh8MA9DVi3TfR0D8BvmluDREiUA',
    tags: ['Fácil Instalação'],
    description: 'Instalação rápida e fácil em qualquer torneira padrão. Alterna entre água comum e purificada com um clique.',
    features: ['Instalação sem Ferramentas', 'Material Antioxidante', 'Fluxo de Água Otimizado']
  },
  {
    id: 5,
    name: 'Kit Família Purificação',
    category: 'Purificadores',
    price: 2899,
    affiliate_price: 2100,
    points_generated: 300,
    points_cost: 6000,
    allow_points_redemption: true,
    rating: 5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOj194k0X-9Ji74YCTqAxdyNDJIdXFOmXGtugIwbr1J2twWftCa8e7RuMahaFLuDdT_625qQxwU0cKmH_JFEnkUTvjiBlu-FXk-5_TNVLJ9Y8bCjvfFFzzJgbsu4NArGnIgPgGTmLxhTwJuyyABfQO4-ddgofTp22Cd1Q-yXlnm9WzG0j7XCSua68VlC9Iz3xc6QWOg_ze_D94ZdAyXMEPThxCFU1Z2j6PXvwRUM9MveeSRJPEwplvQYZyUTeAAZsc9dLl-Ej2KtY',
    tags: ['Econômico'],
    description: 'O sistema definitivo para famílias grandes. Inclui purificador de bancada e adaptador de pia.',
    features: ['Alto Rendimento (15L/h)', 'Ideal para Grande Volume', 'Design Robustu']
  },
  {
    id: 6,
    name: 'Copo Térmico Hydravive',
    category: 'Purificadores',
    price: 159,
    affiliate_price: 110,
    points_generated: 15,
    points_cost: 300,
    allow_points_redemption: true,
    rating: 4,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-6GRTDwUikHQUUVNR6aFASo6GS4a9ywcWBfaxKPHbCzNDLu5NPsaHxw2VTG3rEU5tRxeuHCREcdXt8F_rYhoH6-ZOSN32hQZPndJVTBtgOEgW_J724m4YuuOvInsIxnk-yokTb8qmu028-vp4FXfvC2RtbR_8xg6VyMAC7QaG4nHOAmGMLAe23V_Q2LDHPe5vka-_sl-9een9ogVcYHBB9yLda9mane5qWLo9WXI40iFWPKy46qYif27yKvQqGxjWpmyba7ks7FYM',
    tags: ['Novidade'],
    description: 'Mantenha sua bebida favorita na temperatura perfeita por até 12h fria ou 6h quente.',
    features: ['Parede Dupla a Vácuo', 'Design Ergonômico', 'Compatível com Porta-Copos']
  },
  {
    id: 7,
    name: 'Purificador Classic Plus',
    category: 'Purificadores',
    price: 1230,
    affiliate_price: 890,
    points_generated: 120,
    points_cost: 2500,
    allow_points_redemption: true,
    rating: 5,
    image: '/products/classic-plus/main.jpg',
    images: [
      '/products/classic-plus/main.jpg',
      '/products/classic-plus/1.png',
      '/products/classic-plus/2.jpg',
      '/products/classic-plus/3.png',
      '/products/classic-plus/4.png'
    ],
    tags: ['Clássico', 'Mais Vendido'],
    description: 'O clássico que nunca sai de moda e que sempre valoriza mais ainda o seu ambiente! Principalmente com a bica de saída de água retrátil que permite encher jarras e garrafas com mais facilidade.',
    features: [
      'Vazão nominal: 30 litros/hora',
      'Vida útil refil: 5.400 Litros ou 12 meses',
      'Bica retrátil facilitadora',
      'Garantia de 6 meses'
    ]
  }
];

