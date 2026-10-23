# Publish Focusly as a live website

The website and the Java server are one program, so you publish **one thing**. The repo already contains everything needed:
`Dockerfile` (builds the app), `render.yaml` (creates the site **and** a free PostgreSQL database), and HTTPS comes free from the host.

## Quickest path for beginners (no command line)

1. **GitHub:** create a free account at github.com, click **New repository**, name it `focusly`, keep it **Public**, then **Create**.
2. Click **uploading an existing file**. Unzip `focusly-website.zip` on your computer, open the folder and **drag everything inside it** (the files and folders, not the folder itself) into the page. It has fewer than 100 files, which is GitHub's limit per upload. Click **Commit changes**.
3. **Render:** sign up at render.com with your GitHub account, click **New + → Blueprint**, pick the `focusly` repository, and press **Apply**. Wait 5-8 minutes until it says **Live**.
4. Open the `https://focusly-xxxx.onrender.com` link. This is your website: no localhost, no command, it stays online 24 hours a day.

To change the address to something like `focusly.in`, buy a domain (about Rs 600-900 per year at GoDaddy, Namecheap or Hostinger), then in Render open **Settings → Custom Domains → Add**, and add the DNS record Render shows at the domain seller.

## Option A: Render (easiest, free)

1. Put the project on **GitHub** (see `docs/COMMIT_PLAN.md`). Make sure `.env` and `data/` are **not** committed (they are in `.gitignore`).
2. Create a free account at [render.com](https://render.com) and connect GitHub.
3. Click **New + → Blueprint**, choose your repository, press **Apply**.
   Render reads `render.yaml`, builds the Docker image (about 5-8 minutes the first time), creates the database `focusly-db`, and connects them.
4. When the status says **Live**, open the `https://focusly-xxxx.onrender.com` address. Register an account and add a task.

That address is your published website. It works on every phone and computer, and it can be installed to the home screen (browser menu → **Add to Home screen**).

**Free plan notes:** the site sleeps after about 15 minutes of no visits and takes about 30-60 seconds to wake. The free database is deleted after about 30 days; upgrade the database to a paid plan before you have real users.

## Option B: Railway or any Docker host

Create a project from the GitHub repo, add a PostgreSQL database, and set these variables on the web service:

| Variable | Value |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `postgres` |
| `DB_HOST`, `DB_PORT`, `DB_NAME` | from the database page |
| `DB_USER`, `DB_PASSWORD` | from the database page |

The app reads the `PORT` variable by itself.

## Option C: Your own computer or a VPS

```bash
docker compose -f docker-compose.postgres.yml up -d --build
```

Put a reverse proxy with HTTPS (Caddy or nginx + Let's Encrypt) in front of port 8080.

## Your own web address (optional)

In Render: **Settings → Custom Domains → Add**, then add the DNS record it shows at your domain seller. HTTPS is set up automatically.

## Automatic reminders on the website

Reminders are **built in and always on**. Every day at **9:00 AM** and **8:00 PM** the site rings an on-screen alarm with sound and a snooze button for tasks due within 24 hours or overdue (or nudges the person to start their top task), and a one-time question offers pop-up notifications (pop-ups need https, which the host provides). The times are fixed and cannot be changed or turned off. Web reminders work while the site is open in a browser tab; for reminders when the app is closed, use the phone apps (`docs/MOBILE_APP_GUIDE.md`).

## Launch checklist

- [ ] Register, log in, add, edit, complete and delete a task on the live address
- [ ] Open it on a real phone and install it to the home screen
- [ ] Settings → **Preview reminder** rings; try **Allow pop-ups**
- [ ] Replace `YOUR_EMAIL@example.com` in `privacy.html` with your contact email
- [ ] Delete a test account from Settings → Delete my account
- [ ] No secrets in GitHub (search the repo for passwords)
- [ ] Share the link with your 3 test users and record their feedback in `docs/USER_TESTING.md`
