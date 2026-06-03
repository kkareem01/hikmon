# Google Meet links for booked calls — setup

Every strategy-call booking now creates a real **Google Calendar event with a Google
Meet link**. The link shows up in the customer's confirmation email + `.ics` invite, on
the `/booking-confirmed` page, and in your owner-notification email. The event lands on a
sales rep's calendar (today: just you).

Until the three env vars below are set, bookings still work — they just fall back to the
old "phone call — I'll call you" framing. Nothing breaks while you set this up.

## What you need to do (one time, ~15 min)

You're generating **3 secrets** to put in Vercel:
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`.

### 1. Create a Google Cloud project + enable the Calendar API
1. Go to <https://console.cloud.google.com/> → create a project (e.g. "Hikmon Booking").
2. **APIs & Services → Library** → search **Google Calendar API** → **Enable**.

### 2. Configure the OAuth consent screen
1. **APIs & Services → OAuth consent screen** → User type **External** → fill app name
   ("Hikmon"), your support email, developer email → Save.
2. **Scopes**: add `https://www.googleapis.com/auth/calendar.events` → Save.
3. **Test users**: add the Google account whose calendar the calls should book onto
   (your kareem@hikmon.net Google account). Save.
   - You can leave the app in "Testing" mode — a refresh token from a test user works
     indefinitely for your own account.

### 3. Create an OAuth client → get Client ID + Secret
1. **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
2. Application type **Web application**.
3. Under **Authorized redirect URIs** add: `https://developers.google.com/oauthplayground`
4. Create → copy the **Client ID** and **Client Secret**. These are
   `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

### 4. Mint a refresh token (OAuth Playground)
1. Go to <https://developers.google.com/oauthplayground>.
2. Click the gear (⚙) top-right → check **Use your own OAuth credentials** → paste the
   Client ID + Secret from step 3.
3. Left panel "Step 1": in the **input your own scopes** box, paste:
   `https://www.googleapis.com/auth/calendar.events` → **Authorize APIs**.
4. Sign in with the Google account from step 2 → allow access.
5. "Step 2": click **Exchange authorization code for tokens**.
6. Copy the **Refresh token** value. That's `GOOGLE_REFRESH_TOKEN`.

### 5. Add the 3 vars to Vercel
Vercel → Project (hikmon) → **Settings → Environment Variables** → add for **Production**:

| Name | Value |
|------|-------|
| `GOOGLE_CLIENT_ID` | from step 3 |
| `GOOGLE_CLIENT_SECRET` | from step 3 |
| `GOOGLE_REFRESH_TOKEN` | from step 4 |

Redeploy (or it applies on the next deploy). Book a test call — you should get a Meet link.

## Notes
- **Which calendar?** Controlled in `data/config.json` → `salesReps[].calendarId`.
  `"primary"` = the calendar of the account you authorized in step 4. To book onto a
  different calendar, put its calendar ID there (Google Calendar → that calendar's
  Settings → "Integrate calendar" → Calendar ID).
- **Adding a sales team later** (the high-end-funnel goal): add more entries to
  `salesReps`, each with that rep's `calendarId`, and they'll be assigned round-robin.
  Booking onto *other people's* calendars from one token requires either a Google
  Workspace service account with domain-wide delegation, or each rep sharing their
  calendar with "Make changes to events" to the authorized account. We can wire that
  when you're ready.
- **No new serverless function** was added (the integration is a library used inside the
  existing booking handler), so you stay well under the Hobby 12-function limit.
- The customer does **not** get a duplicate Google invite — we send our own branded
  email + `.ics` (both carrying the Meet link), so `sendUpdates` is set to `none`.
