# ReuseX Project Presentation Guide

## Project at a Glance

**Project name:** ReuseX India  
**Project type:** Responsive second-hand marketplace web application  
**Purpose:** Help people list pre-owned products, discover listings, save favorites, manage their own ads, and contact sellers through private in-app conversations.

ReuseX is designed around a simple marketplace flow: a user creates an account, posts a listing with real product details, and communicates with an interested buyer. Listings and conversations are persisted in MongoDB and protected by account ownership checks on the server.

## Presentation Summary

> ReuseX is a marketplace for buying and selling pre-owned items. Users can browse and filter listings, create an account, post and manage ads, save listings, and message sellers. The React frontend talks to an Express API, while MongoDB stores accounts, listings, favorites, sessions, conversations, and messages.

## Problem and Goal

People selling used goods need a straightforward way to reach interested buyers, while buyers need enough listing information to decide whom to contact. ReuseX brings browsing, item details, seller contact, saved items, and account tools together in one interface.

The goal of the project is to provide the core marketplace experience and persist real user-created data, rather than showing seeded demo listings.

## Main User Features

- Browse listings across categories including cars, bikes, mobiles, electronics, properties, furniture, fashion, hobbies, and services.
- Search and filter listings by text, category, city, price, condition, and other available listing attributes.
- Open a listing to inspect its description, photos, price, location, and seller contact details.
- Register and sign in with email and password.
- Create a listing with seller-entered details, location, price, and HTTPS photo URLs.
- Manage owned listings: view, change the price, mark sold, or delete.
- Save listings to an account-specific favorites list.
- Edit account profile information.
- Start a private conversation with a seller and exchange persisted messages.
- Review safety guidance for in-person transactions.

## Technology Stack

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React 19, TypeScript | Page state, forms, listing browser, account and chat interfaces |
| Styling | Tailwind CSS 4 | Responsive styling and layout |
| Icons | Lucide React | Interface icons |
| Build and development | Vite 6 | Frontend development server and production assets |
| Backend | Node.js, Express 4, TypeScript | HTTP API, validation, session handling, authorization |
| Database | MongoDB with Mongoose | Accounts, listings, favorites, conversations, messages |
| Authentication | bcryptjs, express-session, connect-mongo | Password hashing and persistent server-side sessions |
| Security middleware | Helmet, express-rate-limit | Response security headers and login/register request limits |

## Architecture

```text
Browser (React)
    |
    | same-origin /api requests; Vite proxies these during development
    v
Express API (server/index.ts)
    |
    +-- session middleware reads the HTTP-only session cookie
    +-- account middleware protects private routes and checks ownership
    +-- Mongoose models validate and persist application data
    v
MongoDB database (MONGODB_URI)
```

In development, Vite serves the frontend at `http://localhost:3000` and proxies `/api` to Express on port `3001`. The `npm run dev` script starts both processes. In production, Express serves the built frontend and API from the same origin.

## MongoDB Data Model

### Account

The `accounts` collection stores:

- Name, email, phone, city, and address
- A bcrypt password hash (never the original password)
- Saved listing IDs
- Creation and update timestamps

Emails are normalized to lowercase and unique. Password hashes are excluded from normal account queries.

### Listing

The `listings` collection stores:

- Owning account ID
- Seller name and phone snapshots
- Title, description, price, negotiability, category, and subcategory
- Product image URLs
- City, state, locality, and optional postal code
- Condition, optional specifications, status, and timestamps

The server assigns the owner and seller identity from the authenticated session. The client cannot choose another account as the listing owner. Listing updates and deletions include both the listing ID and current account ID in the database query.

### Conversation and messages

The `conversations` collection stores:

- Listing ID and listing title, price, and image snapshots
- Buyer account ID and seller account ID
- The latest message preview
- Embedded messages with sender account ID, server-derived sender name, message text, and timestamps

A unique database index on the listing and buyer pair prevents duplicate conversations for the same buyer/listing. Only the buyer and seller can read or send messages in that conversation.

### Sessions

The `sessions` collection is managed by `connect-mongo`. It stores server-side login sessions. The browser receives an HTTP-only cookie containing the session identifier, not a copy of the user's profile or password.

## Authentication and Security

1. Registration validates user input and hashes the password with bcrypt.
2. Login checks the submitted password against the stored hash.
3. On successful registration or login, the server rotates the session ID and stores the session in MongoDB.
4. The browser receives an HTTP-only, same-site session cookie; JavaScript cannot read that cookie.
5. Private API routes resolve the account from the session before performing an operation.
6. Listing mutations check that the signed-in account owns the listing.
7. Chat reads and writes check that the signed-in account is a buyer or seller participant.
8. Registration and login endpoints are rate limited.

Registration and login use email and password. Phone OTP and email verification are not implemented because they require an SMS/email delivery provider.

## API Overview

### Authentication and account

| Method | Route | Purpose | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create an account and start a session | Public, rate limited |
| `POST` | `/api/auth/login` | Authenticate and start a session | Public, rate limited |
| `GET` | `/api/auth/me` | Read the signed-in account | Session optional |
| `PATCH` | `/api/auth/me` | Update account profile and owned listing contact snapshots | Signed in |
| `POST` | `/api/auth/logout` | Destroy the session | Session optional |
| `GET` | `/api/auth/favorites` | Read saved listing IDs | Signed in |
| `PUT` | `/api/auth/favorites` | Replace saved listing IDs with valid listings | Signed in |

### Listings

| Method | Route | Purpose | Access |
|---|---|---|---|
| `GET` | `/api/ads` | Return the marketplace listing feed | Public |
| `POST` | `/api/ads` | Create a listing owned by the current account | Signed in |
| `PATCH` | `/api/ads/:id` | Change price or status | Listing owner |
| `DELETE` | `/api/ads/:id` | Delete a listing | Listing owner |

### Chat

| Method | Route | Purpose | Access |
|---|---|---|---|
| `GET` | `/api/chats` | List conversations for the current account | Signed in, participant only |
| `POST` | `/api/chats` | Start or retrieve a conversation for a listing | Signed in; cannot message own listing |
| `POST` | `/api/chats/:id/messages` | Send a message in a conversation | Signed in, conversation participant |

## Typical User Flows

### Sell an item

1. Register or sign in.
2. Choose **Sell**.
3. Enter a title, description, category, condition, price, location, and at least one real HTTPS photo URL.
4. Submit the form.
5. The API validates the content, derives seller identity from the session, and writes the listing to MongoDB.
6. The listing appears in the marketplace feed and the owner's **My Ads** view.

### Contact a seller

1. Open a listing and choose **Message Seller**.
2. Sign in if needed.
3. The API confirms that the listing exists, is active, and is not owned by the current account.
4. The API creates or reuses a conversation for that buyer and listing.
5. Messages are saved in MongoDB with the authenticated sender and server timestamps.
6. The seller signs in and opens **Messages** to read and reply.

Chat currently refreshes conversations when the inbox opens and after a message is sent. It does not use WebSockets or push notifications, so the other participant may need to reopen or refresh the inbox to see new messages.

## Suggested Live Demo

1. Open the marketplace and show that the feed is populated only by database listings; a new database starts with an empty state.
2. Register or sign in to an account.
3. Create a listing with a real photo URL and verify that it appears in the feed and **My Ads**.
4. Save the listing and show that the favorite belongs to the signed-in account.
5. Sign in as a second account and open the listing.
6. Select **Message Seller**, send a message, then sign in as the seller and reply from the inbox.
7. Show that listing controls are owner-only and that chat is limited to conversation participants.
8. In MongoDB Compass, open the `reusex` database and inspect `accounts`, `listings`, `sessions`, and `conversations`.

Use two accounts you control for the demo. Do not display passwords, session cookies, or the contents of `.env` during the presentation.

## Setup and Run

**Prerequisites:** Node.js and a reachable MongoDB server.

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env`.
3. Set `MONGODB_URI` to the MongoDB connection string.
4. Set `SESSION_SECRET` to a unique random value with at least 32 characters.
5. Start the app: `npm run dev`
6. Open `http://localhost:3000`.

Useful checks:

```powershell
npm run lint
npm run build
```

The local environment file contains secrets and is excluded from version control. Do not commit it or include it in presentation screenshots.

## Current Scope and Limitations

- Listings, accounts, sessions, profile updates, favorites, conversations, and chat messages use MongoDB.
- The marketplace starts with no seeded listings; users create the listing data.
- Listing images are currently supplied as HTTPS URLs. Direct file upload and image storage are not implemented.
- Chat persists messages, but delivery is not realtime and there are no read receipts, typing indicators, moderation tools, or notifications.
- There is no payment gateway, checkout, escrow, order management, or purchase history. Do not present those as implemented.
- Phone OTP and email verification are not configured.
- Local MongoDB Server 6.0 is end-of-life. Upgrade to a currently supported MongoDB release before production deployment, and back up the database before upgrading.

## Future Improvements

- Add managed image uploads and image-size/type validation.
- Add WebSockets or a managed messaging service for realtime message delivery.
- Add unread counts, read receipts, reporting, blocking, and moderation.
- Integrate a payment provider before implementing checkout or order claims.
- Add phone/email verification with a delivery provider.
- Add automated API and end-to-end tests, including two-account ownership and conversation authorization tests.
- Deploy the API and frontend over HTTPS with a supported MongoDB deployment, monitoring, backups, and production secrets management.

## Short Speaking Script

> ReuseX is a web marketplace for pre-owned items. The frontend is built with React and TypeScript, and the backend is an Express API connected to MongoDB through Mongoose. Users register with email and password; passwords are hashed, and login sessions are stored server-side in MongoDB. Signed-in users can create and manage their own listings, save favorites, edit their profile, and message a seller. The server checks listing ownership and conversation participants before allowing changes or messages. The current version focuses on listings and messaging; payment processing, OTP verification, and realtime chat are future work.
