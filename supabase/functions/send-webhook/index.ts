// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { fullName, phone, email, type, location } = await req.json()
    console.log('Received webhook data:', { fullName, phone, email, type, location })

    const webhookData = {
      fullName,
      phone,
      email,
      type,
      location,
    }
    console.log('Sending to webhook:', webhookData)

    // Send data to the webhook URL with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const webhookResponse = await fetch('https://hook.eu1.make.com/pkqm196924unp1rfzw2n7o70i4i9ae6x', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!webhookResponse.ok) {
      throw new Error(`Webhook request failed with status: ${webhookResponse.status}`)
    }

    console.log('Webhook call successful')

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in send-webhook function:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})
