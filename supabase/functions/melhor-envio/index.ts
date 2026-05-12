import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const MELHORENVIO_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNTVkNWQ0MzQ0ODRjMGMyZTU5MDgxYjkyOGJjMGM2N2RmYjgxYmMyZjA3ZjM2YjMwOWEwOTNmOGVkNWY1MGY3ZjhhZjdkMjhlMzNhYjc3NjYiLCJpYXQiOjE3Nzc5MDEzNzcuNjg2NTQ5LCJuYmYiOjE3Nzc5MDEzNzcuNjg2NTUxLCJleHAiOjE4MDk0MzczNzcuNjcwNzY4LCJzdWIiOiJhMTcxMDg5YS00NWU3LTRiYTctOGVkNy1hMTk2MTg5ZjlhNGQiLCJzY29wZXMiOlsiY2FydC1yZWFkIiwiY2FydC13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiY29tcGFuaWVzLXdyaXRlIiwiY291cG9ucy1yZWFkIiwiY291cG9ucy13cml0ZSIsIm5vdGlmaWNhdGlvbnMtcmVhZCIsIm9yZGVycy1yZWFkIiwicHJvZHVjdHMtcmVhZCIsInByb2R1Y3RzLWRlc3Ryb3kiLCJwcm9kdWN0cy13cml0ZSIsInByb2R1Y3RzLWRlbGV0ZSIsInByb2R1Y3RzLWRlc3Ryb3kiLCJwcm9kdWN0cy13cml0ZSIsInB1cmNoYXNlcy1yZWFkIiwic2hpcHBpbmctY2FsY3VsYXRlIiwic2hpcHBpbmctY2FuY2VsIiwic2hpcHBpbmctY2hlY2tvdXQiLCJzaGlwcGluZy1jb21wYW5pZXMiLCJzaGlwcGluZy1nZW5lcmF0ZSIsInNoaXBwaW5nLXByZXZpZXciLCJzaGlwcGluZy1wcmludCIsInNoaXBwaW5nLXNoYXJlIiwic2hpcHBpbmctdHJhY2tpbmciLCJlY29tbWVyY2Utc2hpcHBpbmciLCJ0cmFuc2FjdGlvbnMtcmVhZCIsInVzZXJzLXJlYWQiLCJ1c2Vycy13cml0ZSIsIndlYmhvb2tzLXJlYWQiLCJ3ZWJob29rcy13cml0ZSIsIndlYmhvb2tzLWRlbGV0ZSIsInRkZWFsZXItd2ViaG9vayJdfQ.uQBqEJrw2sBfASzxy_rRH6Kk5BId3j7tP0Seqtrs251MQa2S5QdFy8CgJsD_grXM4ZbIXQ3CMp2yVSQTWsLoR9nR2TgddPcxGaSsyM0agn808RiBpuHefiwClnzg7t6X2iQN9C1GEeUs-Y3DO74o0k8thd9Vgg-AeowzGQZbD4A9hvUoY9hs6Lq33mL2e_AfLCb0ToG2Ypf65AHY7Wn_AHdZ-Rx3O6yjhRs2dR7QBZtvdDENPZwtojqf4A5s2dWPePIdXTQtUtN67s8DdSfUuAlvOM66v687WYGhNJKwAEJKb3o-YPVeEeS_tEYHsQceN9GZ27gnsXsjLAXUOQg13asOY4s-420c-gpgoyj01ns4WBXTIyTGdBoSd6jd4Xgf_SRNh0mq47OPSF9cZ4-lYc-36GKo58XtH4MZDjYzubsqRFrugROeYMZBnIFVNycRTMRcTAJKdN3a2Fi2Js1isco3K0u7aDa3J4qwiln-e_cTA43uDAp1F-Yj5KGUBklW8ay_Dxar0Pqq5fkLLTKjcEoJw9nhscMnRHqsSNeXmQietx4r4tZBCyb5q8RPAKNgKRnDkUpqOHw4_3xXhLPsmaAws0DwgtovswrZ8o6PSs1S-8Ntpjf_UXlMMzGuQ7SRnhWBAGgSDbWQwio2kHheOcrrgNT_TFmKWH9t4bkikok";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const { action, payload } = await req.json()
    const MELHORENVIO_URL = 'https://www.melhorenvio.com.br'

    const response = await fetch(`${MELHORENVIO_URL}/api/v2/me/shipment/calculate`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MELHORENVIO_TOKEN}`,
        'User-Agent': 'Hydravive (contato@hydravive.com.br)'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    // Se o Melhor Envio der erro, vamos devolver o erro detalhado
    if (response.status !== 200) {
        console.error('Erro Melhor Envio:', data);
        return new Response(JSON.stringify({ error: 'Erro no Melhor Envio', details: data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: response.status,
        })
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
