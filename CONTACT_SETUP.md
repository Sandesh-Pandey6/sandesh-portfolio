# Contact Form Setup Guide

The contact form sends emails to **sandesh.pandey00112@gmail.com** using [Resend](https://resend.com).

## Step 1: Get a Resend API Key

1. Go to [resend.com](https://resend.com) and sign up (free account).
2. Verify your email address.
3. In the dashboard, go to **API Keys** → **Create API Key**.
4. Copy the key (it starts with `re_`).

## Step 2: Create `.env.local`

1. In your project root (`d:\portifolio`), create a file named `.env.local`.
2. Add this line (replace with your actual key):

```
RESEND_API_KEY=re_your_actual_api_key_here
```

Example:
```
RESEND_API_KEY=re_123abc456def789
```

3. Save the file.

> `.env.local` is in `.gitignore` and will not be committed. Keep your API key private.

## Step 3: Restart the Dev Server

**Important:** Next.js only loads environment variables when the server starts.

1. Stop the dev server: press `Ctrl+C` in the terminal where `npm run dev` is running.
2. Start it again: `npm run dev`
3. Test the contact form at `http://localhost:3000/#contact`

## Troubleshooting

| Error | Solution |
|-------|----------|
| 503 "Email service not configured" | Add `RESEND_API_KEY` to `.env.local` and restart the dev server. |
| 500 "Failed to send message" | Check the Resend dashboard for errors. Verify your account and domain. |
| Still not working after adding key | Ensure you restarted the dev server. Env vars are loaded at startup. |

## Deploying to Vercel

1. In your Vercel project, go to **Settings** → **Environment Variables**.
2. Add `RESEND_API_KEY` with your API key.
3. Redeploy the project.
