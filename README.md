# Shanthi Kasiraj — Fitness & Wellness Portfolio

A bold, forest-green-and-cream portfolio and consultation site for **Shanthi Kasiraj**, certified women's fitness coach & nutritionist, lifted with burnt-orange accents. Built with **React (Vite)** on the front end and **Node.js + Express** on the back end, with a working consultation form that stores enquiries on the server.

## Quick start

```bash
npm run setup   # installs root, server and client dependencies
npm run dev     # starts API (:4000) and React app (:5173)
```

Open http://localhost:5173.

## Production build

```bash
npm run build   # builds the React app into client/dist
npm start       # Express serves the API and the built site on :4000
```

## What's inside

- **Design** — forest green / cream / terracotta palette, oversized Anton display type, Instrument Serif accents, type-led editorial hero, portrait-spread About layout with coaching pillars, ticker marquees, soft noise texture.
- **Interactions** — scroll reveals, animated statistics, sticky active navigation, mobile menu, draggable/scrollable reel rail, auto-playing testimonial slider, FAQ accordion, "choose this programme" preselection, back-to-top.
- **Form** — accessible consultation form with inline validation, honeypot, loading/success states, and server-side validation + rate limiting.
- **Data** — enquiries are appended to `server/data/submissions.json`.

## API

| Method | Route         | Description                              |
| ------ | ------------- | ---------------------------------------- |
| GET    | `/api/health` | Service health check                     |
| POST   | `/api/contact`| Validate + store a consultation enquiry  |

Example payload:

```json
{
  "name": "Ananya R",
  "email": "ananya@example.com",
  "phone": "+91 98765 43210",
  "goal": "Nutrition Coaching",
  "message": "I'd like to build a sustainable plan around a busy schedule.",
  "consent": true
}
```

## Notes

- Imagery and biography are sourced from [shanthikasiraj.com](https://shanthikasiraj.com/) for this demo. Replace assets in `client/public/images` with originals if needed.
- No external database or email service is required. To send notification emails, add Nodemailer in `server/index.js` after `persistSubmission`.
