# DentalAI Widget — Setup Guide

## What's included
- `index.html` — The chatbot (host this on GitHub Pages or any web host)
- `widget.js` — The embed script
- `worker.js` — Your Cloudflare Worker (secure API bridge)

---

## Step 1: Host the chatbot
Upload `index.html` to GitHub Pages (free) or any hosting.
Your URL will look like: `https://yourname.github.io/dental-chat/index.html`

---

## Step 2: Deploy the Cloudflare Worker
1. Go to [workers.cloudflare.com](https://workers.cloudflare.com) → Create Worker
2. Paste the contents of `worker.js`
3. Go to **Settings → Variables** and add:
   - Name: `OPENROUTER_API_KEY`
   - Value: your OpenRouter key (`sk-or-...`)
4. In `worker.js`, add the clinic's domain to `ALLOWED_ORIGINS`
5. Deploy

---

## Step 3: Embed on the clinic's website
Paste this ONE line before `</body>` on their website:

```html
<script
  src="https://YOUR-HOST-URL/widget.js"
  data-chat-url="https://YOUR-HOST-URL/index.html"
  data-color="#0A7B6C"
  data-label="Chat with us"
  data-position="right"
></script>
```

### Customization options
| Attribute | What it does | Example |
|---|---|---|
| `data-color` | Button color (hex) | `#0A7B6C` |
| `data-label` | Button text | `"Book Appointment"` |
| `data-position` | `right` or `left` | `right` |
| `data-chat-url` | URL of your hosted index.html | full URL |

---

## Step 4: Customize for the clinic
Edit these values at the top of `index.html`:

```js
const CLINIC_CONFIG = {
  name: "Bright Smile Dental",
  phone: "+1 555 123 4567",
  email: "hello@brightsmile.com",
  address: "123 Main St, New York",
  emergencyLine: "+1 555 123 4567",
};
```

That's it. The chatbot is live.
