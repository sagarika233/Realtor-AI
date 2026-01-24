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
        timestamp: new Date().toISOString(),
        source: 'realtor_ai_lead_form'
      }
      console.log('Sending to webhook:', webhookData)

      const webhookUrl = 'https://hook.eu1.make.com/84kof5h6f9qy14edqutbabkvmpe5pgst'

      try {
        console.log('Attempting to send to webhook URL:', webhookUrl)

        // Use a shorter timeout for webhook calls
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

        try {
          const webhookResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'RealtorAI-Webhook/1.0',
            },
            body: JSON.stringify(webhookData),
            signal: controller.signal,
          })

          clearTimeout(timeoutId)

          console.log('Webhook response status:', webhookResponse.status)
          console.log('Webhook response headers:', Object.fromEntries(webhookResponse.headers.entries()))

          // Make.com webhooks typically return 200 for success
          if (webhookResponse.status >= 200 && webhookResponse.status < 300) {
            success = true
            console.log('Webhook sent successfully')
            try {
              const responseText = await webhookResponse.text()
              console.log('Webhook response body:', responseText)
            } catch (e) {
              console.log('Could not read response body')
            }
          } else {
            success = false
            errorMessage = `Webhook failed with status: ${webhookResponse.status}`
            console.error('Webhook response not ok:', errorMessage)
            try {
              const responseText = await webhookResponse.text()
              console.error('Webhook response body:', responseText)
            } catch (e) {
              console.error('Could not read response body')
            }
          }
        } catch (fetchError) {
          clearTimeout(timeoutId)
          success = false
          errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'
          console.error('Webhook fetch error:', errorMessage)
          console.error('Error details:', fetchError)
        }
      } catch (error) {
        success = false
        errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('Error in webhook setup:', errorMessage)
      }
    } catch (error) {
      success = false
      errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error in send-webhook function:', errorMessage)
    }

    return new Response(JSON.stringify({ success, error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (unhandledError) {
    console.error('Unhandled error in function:', unhandledError)
    return new Response(JSON.stringify({ success: false, error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})
