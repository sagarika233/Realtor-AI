# Fix Realtor AI: Blank Screen & Backend Connection

The React app crashes immediately due to a missing import in [LandingPage.jsx](file:///c:/Users/sagar/Realtor_AI/lead-form-app/src/components/LandingPage.jsx), causing a blank screen. All other backend integration (Supabase + Make.com webhook) code is already correctly wired. This plan fixes the root crash and polishes safety behaviors.

## Root Cause

[LandingPage.jsx](file:///c:/Users/sagar/Realtor_AI/lead-form-app/src/components/LandingPage.jsx) uses the `CheckCircle` component in the Pricing section (used in all 3 pricing tier feature lists), but **`CheckCircle` is not in the import statement** at line 1. React renders nothing (blank screen) when the bundle throws a reference error at runtime.

## Proposed Changes

### Frontend — `lead-form-app/src/`

#### [MODIFY] [LandingPage.jsx](file:///c:/Users/sagar/Realtor_AI/lead-form-app/src/components/LandingPage.jsx)
- **Add `CheckCircle`** to the `lucide-react` import (critical fix)
- Remove unused `Pause` import (minor cleanup)

#### [MODIFY] [App.jsx](file:///c:/Users/sagar/Realtor_AI/lead-form-app/src/App.jsx)
- Wrap `<Routes>` in a simple React Error Boundary so any future component crash shows a friendly fallback UI instead of a blank screen

#### [MODIFY] [index.html](file:///c:/Users/sagar/Realtor_AI/lead-form-app/index.html)
- Update `<title>` from `lead-form-app` → `Realtor AI`

---

> [!NOTE]
> **Supabase Anon Key**: The key in `.env` (`sb_publishable_rFqKjObrhw5Z4n2zT2mDrw_PT-6mPHk`) is a non-standard format. Supabase anon keys are normally long JWT strings starting with `eyJ`. If dashboard and form submission fail with auth errors after the blank-screen fix, you'll need to copy the correct **anon/public** key from your Supabase project → Project Settings → API. The app code itself is correct — only the credential value needs updating.

> [!IMPORTANT]
> `LeadForm.jsx`, `Dashboard.jsx`, `supabaseClient.js`, and `main.jsx` are **all already correctly implemented** and need no changes.

---

## Verification Plan

### Automated Tests
No existing test files found in the project.

### Manual Verification (after `npm run dev` in `lead-form-app/`)

1. **Landing Page Renders**
   - Open `http://localhost:5173/`
   - Verify: hero section, features, how-it-works, pricing cards all visible (no blank screen)

2. **Lead Form Submission**
   - Scroll to the "Experience the Magic" form
   - Fill in Name, Phone, Email, and click "Get an Instant AI Call"
   - Verify: loading spinner shows, then green success message "Our AI agent will call you shortly."
   - Check Supabase dashboard → Table Editor → `leads` table for the new row

3. **Dashboard**
   - Navigate to `http://localhost:5173/dashboard`
   - Verify: dashboard loads, shows 4 metric cards, and either a leads table or "No leads yet" message
