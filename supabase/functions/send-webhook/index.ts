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

      // Add timeout to prevent function timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 5000) // 5 second timeout
      })

      try {
        console.log('Attempting to send to webhook URL:', webhookUrl)
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

        console.log('Webhook response status:', webhookResponse.status)
        console.log('Webhook response headers:', Object.fromEntries(webhookResponse.headers.entries()))

        if (!webhookResponse.ok) {
          success = false
          errorMessage = `Webhook failed with status: ${webhookResponse.status}`
          console.error('Webhook response not ok:', errorMessage)
          try {
            const responseText = await webhookResponse.text()
            console.error('Webhook response body:', responseText)
          } catch (e) {
            console.error('Could not read response body')
          }
        } else {
          console.log('Webhook sent successfully')
          try {
            const responseText = await webhookResponse.text()
            console.log('Webhook response body:', responseText)
          } catch (e) {
            console.log('Could not read response body')
          }
        }
      } catch (fetchError) {
        success = false
        errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'
        console.error('Webhook fetch error:', errorMessage)
        console.error('Error details:', fetchError)
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
