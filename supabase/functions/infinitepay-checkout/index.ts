import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const { items, order_id, customer, redirect_url, max_installments } = await req.json()

    if (!items || !order_id) {
      throw new Error('Items and order_id are required')
    }

    const formattedItems = items.map((item: any) => ({
      quantity: item.quantity || 1,
      price: Math.round((item.price || item.unit_price) * 100),
      description: item.name || item.description || 'Produto'
    }))

    const payload: any = {
      handle: "rafaella-bueno-830",
      items: formattedItems,
      order_nsu: String(order_id),
      redirect_url: redirect_url || `https://hydravive.com.br/dashboard/financial`,
      customer: customer ? {
        name: customer.name,
        email: customer.email,
        phone_number: customer.phone
      } : undefined
    }

    if (max_installments && max_installments > 0) {
      payload.max_installments = max_installments;
    }

    const response = await fetch('https://api.checkout.infinitepay.io/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status 
      }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
