// @ts-ignore
import { serve, ServerRequest } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req: ServerRequest) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = new TextDecoder().decode(req.body)
    const { fullName, phone, email, type, location } = JSON.parse(body)

    const response = await fetch('https://hook.eu1.make.com/pkqm196924unp1rfzw2n7o70i4i9ae6x', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName,
        phone,
        email,
        type,
        location,
      }),
    })

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in send-webhook function:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
