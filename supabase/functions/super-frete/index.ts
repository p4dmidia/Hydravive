import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SUPERFRETE_TOKEN = Deno.env.get('SUPERFRETE_TOKEN') || "";
const SUPERFRETE_URL = 'https://api.superfrete.com/api/v0/calculator';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const body = await req.json();
    const { action, payload } = body;

    console.log('Action received:', action);
    console.log('Payload received:', JSON.stringify(payload));

    if (action !== 'calculate') {
      return new Response(JSON.stringify({ error: 'Action not supported' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Calcular valor do seguro (soma dos preços * quantidades)
    const insuranceValue = payload.products?.reduce((acc: number, p: any) => {
      const price = parseFloat(p.insurance_value || p.price || 0);
      return acc + (price * (p.quantity || 1));
    }, 0) || 0;

    // Conforme documentação, from e to devem ser objetos com postal_code
    const superFretePayload = {
      from: {
        postal_code: payload.from.postal_code.replace(/\D/g, '')
      },
      to: {
        postal_code: payload.to.postal_code.replace(/\D/g, '')
      },
      services: "1,2,17", // PAC, SEDEX, Mini Envios
      options: {
        own_hand: false,
        receipt: false,
        insurance_value: insuranceValue,
        use_insurance_value: insuranceValue > 0
      },
      products: payload.products.map((p: any) => ({
        quantity: parseInt(p.quantity) || 1,
        weight: parseFloat(p.weight) || 0.5,
        height: parseFloat(p.height) || 10,
        width: parseFloat(p.width) || 10,
        length: parseFloat(p.length) || 10
      }))
    };

    console.log('Sending to SuperFrete:', JSON.stringify(superFretePayload));

    const response = await fetch(SUPERFRETE_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPERFRETE_TOKEN}`,
        'User-Agent': 'Hydravive (contato@hydravive.com.br)'
      },
      body: JSON.stringify(superFretePayload)
    });

    const data = await response.json();
    console.log('SuperFrete Response:', JSON.stringify(data));

    if (response.status !== 200) {
      return new Response(JSON.stringify({ error: 'Erro no Super Frete', details: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    // Mapear resposta
    const mappedOptions = Array.isArray(data) ? data.map((option: any) => {
      if (option.error) {
        return { error: option.error };
      }

      return {
        id: parseInt(option.service_code) || Math.random(),
        name: option.name,
        price: parseFloat(option.price),
        custom_price: parseFloat(option.price),
        discount: parseFloat(option.discount || 0),
        currency: 'R$',
        delivery_time: parseInt(option.delivery_time),
        delivery_range: {
          min: parseInt(option.delivery_time),
          max: parseInt(option.delivery_time) + 2
        },
        company: {
          id: 1,
          name: option.name.includes('Jadlog') ? 'Jadlog' : 'Correios'
        }
      };
    }) : [];

    return new Response(JSON.stringify(mappedOptions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Crash na Edge Function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
