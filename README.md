# Gamified Ed-Tech Platform

A gamified educational platform built with **Next.js**, **TypeScript**, **Prisma**, and **Clerk Authentication**.  
The project includes role-based dashboards, subject/module/topic pages, progress tracking, and a database-backed user/profile system.

---

## Features

- User authentication using Clerk
- Role-based dashboard structure
  - Student dashboard
  - Faculty dashboard
  - Admin dashboard
- Subject, module, and topic pages
- Progress tracking pages
- Prisma database integration
- API routes for user/profile handling
- Reusable UI components
- Responsive layout with sidebar navigation

---

## Tech Stack

- Next.js
- React
- TypeScript
- Prisma
- Clerk
- Tailwind CSS
- Node.js
- npm

---

## Project Structure

```text
src/
├── app/
│   ├── (app)/
│   │   ├── dashboard/
│   │   ├── progress/
│   │   └── subject/
│   ├── api/
│   ├── login/
│   ├── sign-in/
│   └── sign-up/
├── components/
├── lib/
└── types/

prisma/
├── schema.prisma
└── migrations/
Prerequisites

Before running this project, make sure you have installed:

Node.js
npm
Git

Check using:

node -v
npm -v
git --version
How to Clone and Run the Project

Clone the repository:

git clone https://github.com/jainamdavda1-pixel/Gamified_ED-TECH_Platform.git

Go inside the project folder:

cd Gamified_ED-TECH_Platform

Install dependencies:

npm install
Environment Variables

Create a .env.local file in the root folder:

touch .env.local

Add the required environment variables:

DATABASE_URL="your_database_url"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

Do not upload .env.local to GitHub.

Prisma Setup

Generate Prisma client:

npx prisma generate

Run database migrations:

npx prisma migrate dev

Optional: open Prisma Studio to view database data:

npx prisma studio
Run the Development Server

Start the project:

npm run dev

Open in browser:

http://localhost:3000
Build the Project

To check if the project builds successfully:

npm run build

To run the production build:

npm start
Common Issues
1. package.json not found

Make sure you are inside the project folder:

cd Gamified_ED-TECH_Platform

Then run:

npm install
2. Prisma error

Run:

npx prisma generate
npx prisma migrate dev

Also check that DATABASE_URL is correctly added in .env.local.

3. Clerk authentication error

Make sure these values are added in .env.local:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
4. Port already in use

If port 3000 is already running, stop it:

lsof -ti:3000 | xargs kill -9

Then restart:

npm run dev
Updating the Project

After making code changes, push the latest version:

git add -A
git commit -m "Update project"
git push origin main

To get the latest version on another device:

git pull origin main
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
Important Notes
Do not push .env or .env.local files.
Make sure database credentials are correct before running Prisma commands.
Run npm install after pulling new changes.
Run npx prisma generate after changes in schema.prisma.
Repository
https://github.com/jainamdavda1-pixel/Gamified_ED-TECH_Platform

Then save it and push:

```bash
git add README.md
git commit -m "Update README"
git push origin main
