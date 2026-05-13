# Agency Back-End — TODO (Set Up After Initial Client Acquisition)

> **Status:** Parked. Focus right now is cold calling + free demo websites = first paying clients.
> Revisit this once we have 3–5 paying clients

---

## 1. Onboarding Pipeline (CRM Stages)

Build a Kanban-style pipeline with these stages:

```
Booked → Pre-Check Completed → No-Show → Follow-Up → Limbo → Launched
```

- Each stage triggers automations (reminders, rebookings, status transitions).
- "Launched" clients move out of onboarding pipeline → into a **Delivery / Retention pipeline**.
- Pipeline tracks: service type, lead source, account IDs, current open issues.

---

## 2. Failed Payment Workflow

When a payment fails:
1. Auto-tag client in CRM as `payment-failed`.
2. Push them onto a dedicated **Billing Dashboard** for manual review.
3. Trigger a tiered follow-up sequence:
   - **Message 1 — Friendly:** "Hey, looks like your card didn't go through, no worries — quick fix here."
   - **Message 2 — Firm:** "Second notice. Service will pause if not resolved by X."
   - **Message 3 — Direct (final demand):** "Final notice. Account will be suspended on X."

---

## 3. Escalation Management

- Appoint a dedicated **Escalation Manager** (could be me at first, then delegated).
- Their role: resolve issues fast → reduce churn.
- Most common escalation buckets to prepare for:
  - Tech confusion (clients not understanding the portal/dashboard)
  - Payment issues
  - Service breakdowns (site down, ad account issue, etc.)

---

## 4. Cross-System Tagging

- Every client should be tagged consistently across:
  - CRM
  - Billing
  - Support / helpdesk
  - Project management
- Tags should reflect: service type, lead source, lifecycle stage, current issue (if any).

---

## When to Tackle This

Trigger this build-out once **any** of these are true:
- 5+ paying clients
- First failed payment happens
- First "where do I send my logo?" support question gets repeated 3 times

Until then — it's premature infrastructure.
