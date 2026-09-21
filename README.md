# Digital Heroes

Digital Heroes is a subscription-driven web application combining golf performance tracking, charity fundraising, and a monthly draw-based reward engine.

## Problem Statement
The goal is to build a production-quality MVP for the Digital Heroes Golf Performance & Charity Platform. The platform must connect a user's passion for golf with real-world charitable impact. Users track their golf scores (Stableford format), and a portion of their subscription fee is directed to a charity of their choice. Their stored scores serve as their entry into a monthly draw, giving them a chance to win cash prizes based on matches against randomly or algorithmically drawn numbers.

The application prioritizes functional completeness, clean architecture, responsive design, and a modern SaaS aesthetic (deliberately avoiding traditional golf clichés).

## Architecture
The application uses a serverless architecture deployed on Vercel, with a PostgreSQL database hosted on Supabase.
* **Frontend:** Next.js 15 (App Router) generates static pages and dynamic server-rendered pages. Client components manage interactive elements (forms, payment flow).
* **Backend:** Next.js Server Actions handle data mutations (auth, user settings, score entry, draw simulation). NextAuth middleware protects routes and manages sessions.
* **Database Layer:** Prisma ORM provides type-safe interaction with the PostgreSQL database.
* **Payment Processing:** Integrated with Razorpay to handle subscription checkout (simulated).
* **Storage:** Supabase Storage is utilized for winner verification uploads (mocked fallback available for local development).

## Tech Stack
* **Framework:** Next.js 15 (App Router)
* **Language:** JavaScript
* **Styling:** Tailwind CSS v4
* **UI Components:** shadcn/ui, Lucide React, Framer Motion
* **Database:** PostgreSQL (via Supabase)
* **ORM:** Prisma
* **Authentication:** NextAuth (Credentials Provider)
* **Payments:** Razorpay
* **Storage:** Supabase Storage

## Features
1. **Authentication:** Secure email/password login and registration.
2. **Subscriptions:** Monthly and Yearly subscription plans.
3. **Score Management:** Users log their 5 most recent golf scores. New scores automatically replace the oldest.
4. **Charity Selection:** Users select a charity from a directory and define their contribution percentage (min 10%).
5. **Draw Engine:**
    * Random Mode: Pure 1-45 lottery draw.
    * Algorithm Mode: Weighted random selection favoring numbers that appear most frequently across all active users' scores.
6. **Winner Verification:** Winners upload screenshot proof for admin approval before payout processing.
7. **Dashboards:** Dedicated panels for users to track their stats, and admins to manage draws and verify winners.

## Getting Started

### Prerequisites
* Node.js 18+
* PostgreSQL Database

### Setup Instructions

1. **Clone the repository:**
   `git clone <repo_url>`
   `cd <repo_directory>`

2. **Install dependencies:**
   `npm install`

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following keys based on the provided `.env.example`:
   DATABASE_URL="postgresql://user:password@localhost:5432/digitalheroes?schema=public"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   RAZORPAY_KEY_ID="your_razorpay_key"
   RAZORPAY_KEY_SECRET="your_razorpay_secret"
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

4. **Database Setup:**
   Run the following commands to push the schema and seed the database with an initial admin user and charities:
   `npx prisma db push`
   `node prisma/seed.js`

   *Admin Credentials after seeding:*
   - **Email:** admin@digitalheroes.com
   - **Password:** admin123

5. **Run the Development Server:**
   `npm start`

## Deployment
The application is configured to be deployed on Vercel. Ensure all environment variables are added to the Vercel project settings prior to deployment.
