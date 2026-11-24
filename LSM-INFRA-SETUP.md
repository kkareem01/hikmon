# LSM Infrastructure Setup

On 2026-11-23 every file was renamed to Local Service Marketers / LSM. The code now points at new
addresses that still have to be set up in Vercel, DNS, Google, Resend, Cloudinary, GitHub and
Instantly. Until a step is done, the parts that depend on it won't work.

Do the steps in order.

> This is a temporary checklist. It names the old accounts and projects because that's what
> they're still called. Delete this file once every box is checked.

## What the code now expects

| Thing | New value |
|---|---|
| Email addresses | `kareem@localservicemarketers.com`, `support@localservicemarketers.com` |
| Form-alert service | `https://notify.localservicemarketers.com` (Vercel project `lsm-notify`) |
| Demo sites | `<name>.localservicemarketers.com`, e.g. `conserve-hvac.localservicemarketers.com` |
| Website Vercel project | `lsm` |
| GitHub repo | `kkareem01/lsm` |
| Cloudinary | cloud name `lsm`, upload preset `lsm_onboarding_unsigned`, folder `lsm` |
| Instantly campaign | `lsm-outbound-hvac` |

---

## 1. Email

Do this first, because everything sends from these addresses.

- [ ] Create `kareem@` and `support@localservicemarketers.com`. In Google Workspace, add the domain under **Admin → Domains**, then add the addresses.
- [ ] The site sends booking and welcome emails through Resend. In **Resend → Domains → Add** `localservicemarketers.com`, add the DNS records it gives you at your domain provider, and wait for it to show **Verified**.
- [ ] In Google Cloud's **OAuth consent screen** (the booking setup in `GOOGLE_MEET_SETUP.md`), change the support email to the new address.

## 2. Form-alert service

Do this before redeploying any client site, because their lead forms now send to the new address.

- [ ] **Vercel →** `hikmon-notify` **project → Settings → General →** rename it to `lsm-notify`.
- [ ] **Settings → Domains →** add `notify.localservicemarketers.com`.
- [ ] At your domain provider, add a CNAME record: `notify` → `cname.vercel-dns.com`.
- [ ] In the project's **Environment Variables**, change any old addresses in `ALLOWED_ORIGINS` to the new ones (e.g. `https://conserve-hvac.localservicemarketers.com`).
- [ ] Redeploy:
  ```bash
  cd "/Users/kkareem_1/Documents/Claude COde/Everything LSM/workflow/notify-service" && node deploy.mjs
  ```
- [ ] Check it. Any answer other than a connection or certificate error means the domain is working:
  ```bash
  curl -I https://notify.localservicemarketers.com/api/notify
  ```

## 3. Website on Vercel

- [ ] Rename the Vercel project `hikmon` to `lsm`.
- [ ] Under **Environment Variables**, update these to the new values (your local `.env` files are already updated; the dashboard is separate):
  - `FROM_EMAIL` → `kareem@localservicemarketers.com`
  - `KAREEM_EMAIL` → `kareem@localservicemarketers.com`
  - `OWNER_EMAIL` → `kareem@localservicemarketers.com`
  - `CLOUDINARY_CLOUD_NAME` → `lsm`
  - `CLOUDINARY_UPLOAD_PRESET` → `lsm_onboarding_unsigned`
  - `SITE_ORIGIN` → `https://localservicemarketers.com`
- [ ] Redeploy from the new folder:
  ```bash
  cd "/Users/kkareem_1/Documents/Claude COde/Web Design/Local Service Marketers" && vercel --prod
  ```

## 4. GitHub

- [ ] Rename the repo:
  ```bash
  gh repo rename lsm -R kkareem01/hikmon
  ```
- [ ] Point the local copy at the new name:
  ```bash
  cd "/Users/kkareem_1/Documents/Claude COde/Web Design/Local Service Marketers"
  git remote set-url origin https://github.com/kkareem01/lsm.git
  ```
  Vercel's GitHub connection follows a renamed repo on its own.

## 5. Demo sites

- [ ] At your domain provider, add a wildcard record: `*` CNAME → `cname.vercel-dns.com`. If Vercel says wildcards need its nameservers, move the domain's nameservers to Vercel.
- [ ] For the existing Conserve HVAC demo, add `conserve-hvac.localservicemarketers.com` under **Domains** in the `conserveheatingandcooling` project.
- [ ] Decide when to retire `hikmon.dev`. Demo links already sent to prospects only keep working while it stays live.

## 6. Cloudinary

- [ ] Change the cloud name to `lsm`, or create a new environment called `lsm`.
- [ ] Create an **unsigned** upload preset named `lsm_onboarding_unsigned` that saves to the `lsm` folder.
- [ ] Uploads already in the old `hikmon/` folder won't be found anymore. Move them into `lsm/` if you still need them.

## 7. Instantly

- [ ] Rename the campaign to `lsm-outbound-hvac`. Its ID doesn't change, so nothing in the code needs updating.
- [ ] Change the sender display name to **Local Service Marketers**.
- [ ] If you send from `@hikmon.net` addresses, set up new sending addresses on backup domains (not `localservicemarketers.com` itself, so cold-email spam complaints can't hurt your main domain) and give them 2–3 weeks of warm-up.

## 8. Redeploy the client sites

Only after step 2 works. Their forms send to the new alert address and won't work until it's live.

- [ ] Madd Stripe X Detailing: `Everything LSM/Client Website/maddstripexdetailing`
- [ ] Top Home Renovations: `Everything LSM/Client Website/tophomerenovations-deploy`
- [ ] Conserve HVAC demo: `Everything LSM/Master Web Builder Machine/HVAC Template Website 1`

After each one, submit a test lead on the live site and confirm the text alert arrives.

---

When every box is checked, delete this file.
