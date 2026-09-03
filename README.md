# gas.bolmso.app

A directory of Google Apps Script projects — explanations, install guides, GitHub
links and screenshots. Built with Next.js + Tailwind and styled with Google
Material Design 3.

## Local development

```bash
npm install
npm run dev
```

## Managing the directory

All content lives in one file: **`src/data/projects.ts`**.

### Including / excluding a project

Each project has an `enabled: boolean` field. Set it to `false` to hide a
project from the directory (it won't appear on the home page or have a detail
page). Set it back to `true` to show it again.

```ts
{
  id: "ch-packschein",
  enabled: true,   // <- flip to false to hide
  ...
}
```

### Adding a project

1. Add a new object to the `projects` array in `src/data/projects.ts`.
2. Give it a unique kebab-case `id` and fill in the fields (name, tagline,
   description, features, category, githubUrl, installNotes, installType, ...).
3. Set `enabled: true`.

### Adding screenshots

1. Create a folder: `public/screenshots/<project-id>/`
2. Drop your images in it (e.g. `public/screenshots/ch-packschein/shot1.png`).
3. Add the paths to that project's `screenshots` array:

```ts
screenshots: ["/screenshots/ch-packschein/shot1.png"],
```

Screenshots render on the project's detail page.

## Deploying

Push to GitHub and import into Vercel as its own project, then attach the
`gas.bolmso.app` domain. Because the hub (`bolmso.app`) auto-discovers apps via
the Vercel API, the new subdomain will appear there automatically once verified.
