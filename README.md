# 🦷 DentalAI Widget — Setup Guide

A plug-and-play AI chatbot for dental clinics. Books appointments, answers questions, and captures leads — automatically.

---

## What's Included

| File | Purpose |
|---|---|
| `index.html` | The chatbot UI (host on GitHub Pages or any web host) |
| `widget.js` | Embed script — one line adds the chat button to any website |
| `worker.js` | Cloudflare Worker — secure AI proxy + lead storage |
| `README.md` | This setup guide |

---

## Step 1 — Customize the Clinic Details

Open `index.html` and edit the `CLINIC_CONFIG` block near the top of the `<script>` section:

```js
const CLINIC_CONFIG = {
  name:          "Bright Smile Dental",
  phone:         "+1 (555) 123-4567",
  email:         "hello@brightsmile.com",
  website:       "https://brightsmile.com",
  bookingLink:   "https://brightsmile.com/book",
  address:       "123 Main St, New York, NY",
  emergencyLine: "+1 (555) 123-4567",
};
```

You can also update the `KNOWLEDGE_BASE` section below it with real pricing, hours, and FAQs for the clinic.

---

## Step 2 — Host the Chatbot (Free with GitHub Pages)

1. Create a GitHub account at [github.com](https://github.com) (free)
2. Create a new repository — e.g. `dental-chat`
3. Upload `index.html` and `widget.js` to the repository
4. Go to **Settings → Pages → Source → main branch** → Save
5. Your chatbot will be live at:
   `https://YOUR-USERNAME.github.io/dental-chat/index.html`

---

## Step 3 — Deploy the Cloudflare Worker

1. Go to [workers.cloudflare.com](https://workers.cloudflare.com) → Sign up (free) → **Create Worker**
2. Paste the full contents of `worker.js` into the editor
3. Click **Deploy**

### Add your API key (required)
Go to your Worker → **Settings → Variables → Add Variable**:

| Variable Name | Value |
|---|---|
| `OPENROUTER_API_KEY` | Your OpenRouter key (`sk-or-...`) — get one free at [openrouter.ai](https://openrouter.ai) |
| `DASH_PASSWORD` | A password you choose for the leads dashboard |
| `WEB3FORMS_KEY` | Free email key from [web3forms.com](https://web3forms.com) |
| `NOTIFY_EMAIL` | Your email address for lead notifications |

### Create the KV database (for storing leads)
1. In Cloudflare: **Workers & Pages → KV → Create namespace**
2. Name it: `LEADS`
3. Go to your Worker → **Settings → Variables → KV Namespace Bindings**
4. Add binding: Variable name = `LEADS`, Namespace = the one you just created

### Add allowed domains
Open `worker.js` and add the clinic's website and your GitHub Pages URL to `ALLOWED_ORIGINS`:

```js
const ALLOWED_ORIGINS = [
  'https://YOUR-USERNAME.github.io',
  'https://clinicwebsite.com',   // ← add clinic domain here
];
```

---

## Step 4 — Embed on the Clinic's Website

Paste this **one line** before `</body>` on their website:

```html
<script
  src="https://YOUR-USERNAME.github.io/dental-chat/widget.js"
  data-chat-url="https://YOUR-USERNAME.github.io/dental-chat/index.html"
  data-color="#0A7B6C"
  data-label="Chat with us"
  data-position="right"
></script>
```

### Customization options

| Attribute | What it does | Example |
|---|---|---|
| `data-color` | Button color (any hex color) | `#0A7B6C` |
| `data-label` | Button text | `"Book Appointment"` |
| `data-position` | Button side — `right` or `left` | `right` |
| `data-chat-url` | URL of your hosted `index.html` | full `https://` URL |

---

## Step 5 — View Captured Leads

Send a GET request to your Worker with the dashboard password header:

```
GET https://YOUR-WORKER.workers.dev/leads
Header: x-dash-password: YOUR_DASH_PASSWORD
```

You can test this in your browser using a tool like [Hoppscotch](https://hoppscotch.io) or [Postman](https://postman.com).

---

## Testing Checklist

- [ ] Open `index.html` directly in a browser — chatbot should load and respond
- [ ] Try the quick reply buttons
- [ ] Type "I want to book an appointment" — lead capture flow should start
- [ ] Enter a name and phone number — check your email for the lead notification
- [ ] Embed `widget.js` on a test page — chat button should appear bottom-right

---

## Troubleshooting

**Chat says "Unable to reach the AI"**
→ Check your `OPENROUTER_API_KEY` is set in Cloudflare Worker variables
→ Make sure the domain is listed in `ALLOWED_ORIGINS` in `worker.js`

**Not receiving lead emails**
→ Confirm `WEB3FORMS_KEY` and `NOTIFY_EMAIL` are set in Worker variables
→ Check your spam folder

**Widget button not showing on the clinic site**
→ Make sure the `data-chat-url` attribute points to the correct `https://` URL
→ Confirm the clinic domain is in `ALLOWED_ORIGINS`

---

## Support

Questions? Email: md.motiur52@gmail.com
