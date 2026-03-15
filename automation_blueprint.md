# Realtor AI Automation Blueprint: Automatic Call Trigger
*Configuring your Make.com scenario for instant, zero-click AI calls.*

This blueprint outlines the exact modules and configuration needed in [Make.com](https://www.make.com) to ensure that every lead submission triggers an AI call **automatically and immediately**.

---

## 1. The Workflow Sequence (Make.com)

Your scenario must be configured with these three modules in order:

1. **Webhooks** (Custom Webhook)
2. **Google Sheets** (Add a Row)
3. **HTTP** (Make a Request)

---

## 2. Module Configuration

### Step 1: Webhooks → Custom Webhook
- **Action:** Create a new webhook.
- **URL:** Copy and paste this into your project environment (e.g., `.env` or `script.js`).
- **Scheduling:** Set to **"Immediately as data arrives"**.

### Step 2: Google Sheets → Add a Row (Recommended)
- **Sheet:** Select your "Leads" spreadsheet.
- **Mapping:** Map `name`, `email`, `phone`, and `intent` from the Webhook payload to your columns.

### Step 3: HTTP → Make a Request (AI Call Trigger)
- **URL:** `https://api.your-ai-calling-service.com/calls` (or your provider's endpoint)
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_API_KEY`
- **Body Type:** Raw JSON
- **Body Content:**
  ```json
  { 
    "assistantId": "8a2595af-12ed-4f5d-978f-a522b646267f", 
    "phoneNumberId": "65f2cbe4-d8ff-4cf7-8786-cf70c2f4ebdc", 
    "customer": { 
      "number": "{{phone}}" 
    } 
  }
  ```
  *(Note: Replace `{{phone}}` with the mapped phone number variable from your webhook/spreadsheet module.)*

---

## 3. Deployment Checklist

- [ ] **Scenario State:** Ensure the scenario is toggled to **ON**.
- [ ] **No Manual Steps:** Verify there are no "confirmation" or "approval" modules (like email or Slack approvals) before the HTTP module.
- [ ] **Logging:** The HTTP module will show a successful response (Status 200/201) in your scenario execution history, confirming the call request was accepted by the AI provider.

---

## Result
Once configured, the workflow is:
**Website Submission** → **Make Receives Data** → **Lead Logged** → **AI Call Triggered**

The lead will receive a call within seconds of clicking "Get an Instant AI Call" on your website.
