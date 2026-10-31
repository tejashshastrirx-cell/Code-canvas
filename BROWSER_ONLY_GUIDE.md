# Browser-only guide (no local installs)

## Option A — Claude Code Web (primary)
**Where code runs:** in an Anthropic cloud container (Linux, Node 22, Chromium + Playwright preinstalled). Your competition PC only needs a browser.
1. Go to **https://claude.ai/code**, sign in with your normal Claude account.
2. Choose this GitHub repository in the repo selector (connect GitHub when prompted the first time) → start a session.
3. First message: `npm ci && npm run build && npm run assets:verify` (deps install in the container from `package-lock.json`, ~1 min).
4. Paste `COMPETITION_MASTER_PROMPT.md` + the brief.
5. **Preview:** the container has no public URL. Use `npm run qa` (Claude views screenshots), or push and open the repo in StackBlitz (Option B) for a live preview, or deploy `dist/` (below).
6. **Saving:** Claude commits and pushes to GitHub (`git push`). Anything not pushed is lost when the container is reclaimed.

## Option B — StackBlitz (live preview in the browser, no login needed to view)
- Open `https://stackblitz.com/github/<owner>/<repo>` → it runs `npm install` + `npm run dev` in-browser (WebContainers). Hot reload preview appears on the right.
- Works best in Chrome/Edge. Large assets (~27 MB) load from the repo — first load takes a minute.
- To save edits from StackBlitz, sign in with GitHub and commit, or keep editing via Claude Code Web.

## Option C — GitHub Codespaces (optional)
- Repo page → **Code → Codespaces → Create**. Free personal quota applies (monthly core-hours). Run `npm ci && npm run dev`; port 5173 is forwarded with a preview URL.

## Deploy for submission (free, browser-only)
- `dist/` uses relative paths + HashRouter, so it works on any static host or sub-path.
- Fastest: Netlify Drop (drag `dist` folder) — needs local files, so from a browser-only PC use **Vercel/Netlify “Import from GitHub”** (build `npm run build`, output `dist`), or GitHub Pages via Actions.

## What needs internet / separate auth
| Feature | Internet? | Auth |
|---|---|---|
| Running the site (all assets local, fonts local) | No (after load) | — |
| npm install | Yes | — |
| Asset discovery/download scripts | Yes | Sketchfab downloads need your token |
| Spline MCP | Yes | Connect in claude.ai connectors (OAuth) |
| Figma MCP | Yes | Already connected to your claude.ai account |
| GitHub push | Yes | Repo must be attached to the Claude Code session |

Storing `.mcp.json` in the repo does **not** make MCP tools available or authenticated.
