// @ts-ignore
import { serve } from "https://deno.land/std@0.224.0/http/server.ts"

serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    let success = true
    let errorMessage = ''

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

      const webhookUrl = 'https://hook.eu1.make.com/84kof5h6f9qy14edqutbabkvmpe5pgst'

      // Add timeout to prevent function timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 5000) // 5 second timeout
      })

      try {
        const webhookResponse = await Promise.race([
          fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData),
          }),
          timeoutPromise
        ]) as Response

        if (!webhookResponse.ok) {
          success = false
          errorMessage = `Webhook failed with status: ${webhookResponse.status}`
          console.error('Webhook response not ok:', errorMessage)
        } else {
          console.log('Webhook sent successfully')
        }
      } catch (fetchError) {
        success = false
        errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'
        console.error('Webhook fetch error:', errorMessage)
      }
    } catch (error) {
      success = false
      errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error in send-webhook function:', errorMessage)
    }

    return new Response(JSON.stringify({ success, error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: success ? 200 : 400,
    })
  } catch (unhandledError) {
    console.error('Unhandled error in function:', unhandledError)
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})
