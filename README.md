<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# ReuseX

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/29206f80-bfca-4818-9594-7d6070a2443a

## Run Locally

**Prerequisites:** Node.js and a MongoDB instance (local or MongoDB Atlas).

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` to your database connection string.
3. Replace `SESSION_SECRET` with a unique random string of at least 32 characters. You can generate one with `node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"`.
4. Start both the API and frontend with `npm run dev`. The frontend is available at `http://localhost:3000`; Vite proxies `/api` requests to the Express API on port `3001`.

Set `GEMINI_API_KEY` in `.env` as well if your deployment uses Gemini features.

The API stores accounts, login sessions, profile changes, saved listing IDs, user-posted listings, conversations, and messages in MongoDB. Passwords are hashed with bcrypt, session cookies are HTTP-only and same-site (secure in production), and registration/login are rate limited. Listings and conversations are restricted to their authorized owners and participants. There are no seeded marketplace listings. Email/password authentication is implemented; phone OTP and email verification require a delivery provider and are not enabled. Online purchases remain disabled because no payment provider is configured; buyers can message sellers or contact them using the phone number on a listing.

For production, build the frontend with `npm run build`, set `NODE_ENV=production`, `MONGODB_URI`, `SESSION_SECRET`, and `PORT`, then run `npm start`. The Express server serves the built frontend and API from the same origin.
