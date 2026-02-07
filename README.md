# Sandesh Pandey - Portfolio Website

A modern, responsive personal portfolio built with Next.js, React, and Tailwind CSS.

## Tech Stack

- **Frontend:** React (Next.js App Router)
- **Styling:** Tailwind CSS
- **Backend:** Next.js API routes (contact form)

## Features

- Clean, developer-focused UI with light/dark mode
- Fully responsive (mobile, tablet, desktop)
- Smooth scrolling and subtle animations
- Sections: Hero, About, Skills, Projects, Education, Contact
- Contact form with API route handling

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Build & Deploy

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Deploy to Vercel

1. Push your code to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com](https://vercel.com) and sign in. Click **Add New** → **Project** and import your repository.
3. Vercel will detect Next.js automatically. Keep the default settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`
4. (Optional) For the contact form to send email, add an environment variable in **Settings → Environment Variables**:
   - Name: `RESEND_API_KEY`  
   - Value: your Resend API key (see [CONTACT_SETUP.md](./CONTACT_SETUP.md)).
5. Click **Deploy**. The project uses Node ≥18.17.0 (see `package.json` `engines` and `.nvmrc`).


