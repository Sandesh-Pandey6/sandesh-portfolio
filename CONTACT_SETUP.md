# Contact Form Setup Guide

The contact form sends emails to **sandesh.pandey00112@gmail.com** using [Resend](https://resend.com).

**Important:** Sign up for Resend with **sandesh.pandey00112@gmail.com**. On the free plan, `onboarding@resend.dev` can only deliver to the email you used for your Resend account.

## Step 1: Get a Resend API Key

1. Go to [resend.com](https://resend.com) and sign up (free account) with **sandesh.pandey00112@gmail.com**.
2. Verify that Gmail inbox.
3. In the dashboard, go to **API Keys** → **Create API Key**.
4. Copy the key (it starts with `re_`).

## Step 2: Create `.env.local`

1. In your project root, create a file named `.env.local`.
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
| 500 "Failed to send message" | Open the [Resend dashboard](https://resend.com/emails) → **Emails** to see delivery logs. |
| Email not in inbox | Check **Spam** and **Promotions**. Search for subject `Portfolio: message from`. |
| Still not working after adding key | Restart `npm run dev`. Env vars load only at server start. |
| Works locally, not on live site | Add `RESEND_API_KEY` in Vercel → Settings → Environment Variables, then redeploy. |

## Deploying to Vercel

1. In your Vercel project, go to **Settings** → **Environment Variables**.
2. Add `RESEND_API_KEY` with your API key.
3. Redeploy the project.
