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

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch('https://hook.eu1.make.com/pkqm196924unp1rfzw2n7o70i4i9ae6x', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log('Webhook response status:', response.status)
      const responseText = await response.text()
      console.log('Webhook response text:', responseText)

      // Always return success to the client, even if webhook fails
      // Log the webhook failure but don't throw an error
      if (!response.ok) {
        console.error(`Webhook failed: ${response.status} ${response.statusText} - ${responseText}`)
        // Still return success to client since data was processed
      } else {
        console.log('Webhook succeeded')
      }
    } catch (webhookError) {
      console.error('Webhook fetch failed:', webhookError)
      // Log the error but continue to return success
    }

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
