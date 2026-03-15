// Realtor AI Node.js Webhook Server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { WebClient } = require('@slack/web-api');
const { google } = require('googleapis');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Integrations
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("CRITICAL ERROR: SUPABASE_URL or SUPABASE_ANON_KEY is missing from environment variables.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const slackClient = SLACK_BOT_TOKEN ? new WebClient(SLACK_BOT_TOKEN) : null;

// Step 1: Receive Form Webhook and Trigger AI Call
app.post('/webhook/new-lead', async (req, res) => {
    try {
        const leadData = req.body;
        
        // Ensure lead reached Supabase
        const { data: dbLead, error } = await supabase
            .from('leads')
            .select('*')
            .eq('email', leadData.email)
            .single();
            
        if (error) throw new Error("Lead not found in Supabase.");

        // Here we trigger the AI Voice Provider (Example: Bland AI / Vapi)
        // You would replace this URL and Key with your specific provider
        const aiResponse = await fetch('https://api.bland.ai/v1/calls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.VOICE_AI_API_KEY}`
            },
            body: JSON.stringify({
                phone_number: leadData.phone,
                task: `You are Realtor AI. Call ${leadData.name}. Ask about their property preferences. They want a ${leadData.property_type} in ${leadData.location} with a budget of ${leadData.budget}. Try to book an appointment with our agent.`,
                record: true,
                webhook: `${process.env.YOUR_SERVER_URL}/webhook/call-result`,
                metadata: { lead_id: dbLead.id } // Pass our DB ID so we can identify the callback
            })
        });

        if (!aiResponse.ok) throw new Error("AI Call Failed to trigger");

        res.status(200).json({ success: true, message: "AI Call Triggered" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Helper Function: Book Google Calendar Appt
async function bookCalendarAppointment(leadInfo) {
    if (!process.env.GOOGLE_CALENDAR_ID || !process.env.GOOGLE_CREDENTIALS) return;

    try {
       // Simplified OAuth Setup (Requires actual credentials JSON)
       const auth = new google.auth.GoogleAuth({
           keyFile: './google-credentials.json',
           scopes: ['https://www.googleapis.com/auth/calendar.events']
       });
       const calendar = google.calendar({ version: 'v3', auth });

       const event = {
           summary: `Qualified Lead Sync: ${leadInfo.name}`,
           description: `Budget: ${leadInfo.budget}\nTimeline: ${leadInfo.timeline}\nPhone: ${leadInfo.phone}\nTranscript: ${leadInfo.transcript}`,
           start: { dateTime: new Date(Date.now() + 86400000).toISOString() }, // Simplified to tomorrow
           end: { dateTime: new Date(Date.now() + 90000000).toISOString() }, // 1 hr later
       };

       await calendar.events.insert({
           calendarId: process.env.GOOGLE_CALENDAR_ID,
           resource: event,
       });
       console.log("Calendar appointment booked.");
    } catch(err) {
       console.error("Failed to book calendar", err);
    }
}

// Helper Function: Mock AI Analysis (Replaces OpenAI call)
async function analyzeCall(transcript) {
    // In production, you would pass `transcript` to OpenAI API here.
    return {
        score: Math.floor(Math.random() * 41) + 60, // 60-100 score
        recommendations: [
            { id: 1, address: "123 Cherry Lane", match: "95%", price: "$450k" },
            { id: 2, address: "789 Pine Ave", match: "88%", price: "$480k" }
        ]
    };
}

// Helper Function: Mock SMS sending (Replaces Twilio)
async function sendSMS(phone, message) {
    console.log(`[MOCK TWILIO] Sent SMS to ${phone}: "${message}"`);
    return true; // assume success
}

// Step 4: Receive Call Result from AI Provider
app.post('/webhook/call-result', async (req, res) => {
    try {
        // The payload structure depends on the provider. We assume a standard structure.
        const { metadata, transcript, call_length, variables, recording_url } = req.body;
        const leadId = metadata.lead_id;
        
        // Perform AI Analysis (Scoring & Recommendations)
        const analysis = await analyzeCall(transcript);

        // Save Transcript, Status, and Premium fields to Supabase
        await supabase
            .from('leads')
            .update({ 
                call_transcript: transcript,
                call_status: status,
                recording_url: recording_url || null,
                lead_score: analysis.score,
                property_recommendations: analysis.recommendations
            })
            .eq('id', leadId);

        // Fetch lead details for notification
        const { data: lead } = await supabase.from('leads').select('*').eq('id', leadId).single();

        let smsSent = false;

        if (status === 'qualified') {
            // Update appointment boolean
            await supabase.from('leads').update({ appointment_booked: true }).eq('id', leadId);

            // Book Calendar
            await bookCalendarAppointment({ ...lead, transcript });

            // Send Slack Notification
            if (process.env.SLACK_BOT_TOKEN) {
                await slackClient.chat.postMessage({
                    channel: process.env.SLACK_CHANNEL_ID,
                    text: `🚨 *NEW QUALIFIED LEAD!* 🚨\nName: ${lead.name}\nPhone: ${lead.phone}\nBudget: ${lead.budget}\nThe AI booked them on your calendar. Check out the transcript in Supabase!`
                });
            }
        } else {
             // Send follow-up ping in Slack
             if (process.env.SLACK_BOT_TOKEN) {
                await slackClient.chat.postMessage({
                    channel: process.env.SLACK_CHANNEL_ID_FOLLOWUP,
                    text: `Cold Lead: ${lead.name} didn't qualify. Added to drip campaign.\nTranscript: ${transcript}`
                });
            }
            
            // Send Automated SMS Follow-up
            const msg = `Hi ${lead.name}, this is Realtor AI following up. Let me know if you are still looking for a ${lead.property_type}!`;
            smsSent = await sendSMS(lead.phone, msg);
        }

        // Update SMS sent status
        if (smsSent) {
            await supabase.from('leads').update({ sms_sent: true }).eq('id', leadId);
        }

        res.status(200).json({ success: true, message: "Call processed." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Realtor AI Webhook Server running on port ${PORT}`);
});
