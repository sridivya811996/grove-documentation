# Grove Documentation (Docusaurus)

This repo hosts Grove documentation as a Docusaurus site.

## Local dev
```powershell
npm install
npm run start
```

## Build
```powershell
npm run build
```

## Structure
- `docs/` contains all documentation (organized into product/architecture/ux-design/engineering/operations).
- `static/files/` contains downloadable assets (CSV/HTML).
- `static/img/` contains logo + favicon.

## Deploy to GitHub Pages
This repo is configured for GitHub Pages hosting from the `gh-pages` branch.

### One-time setup
1) Push this repo to GitHub: `https://github.com/sridivya811996/grove-documentation.git`
2) In GitHub: Settings ? Pages ? Source = GitHub Actions

### Deploy via GitHub Actions
The workflow is located at `.github/workflows/deploy.yml` and will publish on every push to `main`.

### Publish URL
Once the first deploy finishes, your docs will be live at:
`https://sridivya811996.github.io/grove-documentation/`

## Deploy alternatives
- Netlify or Vercel also work if you prefer those platforms.
