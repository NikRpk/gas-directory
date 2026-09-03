# gas.bolmso.app — Bolmsö Scripts

A directory of Google Apps Script projects — explanations, install guides, GitHub
links and screenshots. Built with Next.js + Tailwind and styled with Google
Material Design 3.

## Local development

```bash
npm install
npm run dev
```

For the admin area locally, create `.env.local` (gitignored):

```
ADMIN_PASSWORD=your-password
GITHUB_TOKEN=<github token with repo scope>
GITHUB_REPO=NikRpk/gas-directory
```

## Admin UI

Go to **/admin** (linked in the footer) and log in with the admin password.

From there you can:

- **Show / hide** a project (the `enabled` flag)
- **Delete** a project
- **Add** a new project (name, description, category, GitHub link, install notes, features)
- **Upload / remove screenshots** per project

How it works: every change is committed back to this repo via the GitHub API
(`src/data/projects.json` for data, `public/screenshots/<id>/` for images), and
Vercel auto-deploys on push — changes go live in about a minute. The admin UI
always reads the latest committed state from GitHub, so it reflects changes
immediately even while the public site is still redeploying.

## Managing data by hand

All content lives in **`src/data/projects.json`**. Each project has an
`enabled: true/false` flag. Edit and push — Vercel redeploys automatically.

Screenshots live in `public/screenshots/<project-id>/` and are referenced in
each project's `screenshots` array, e.g.:

```json
"screenshots": ["/screenshots/ch-packschein/shot1.png"]
```

## Environment variables (Vercel)

- `ADMIN_PASSWORD` — password for the admin UI
- `GITHUB_TOKEN` — GitHub token with `repo` scope (used for admin commits)
- `GITHUB_REPO` — `NikRpk/gas-directory`

## Deploying

Push to `main` — Vercel auto-deploys. The site is attached to `gas.bolmso.app`
and the hub (`bolmso.app`) auto-discovers it via the Vercel API.
