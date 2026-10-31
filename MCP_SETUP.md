# MCP Setup

**Key fact:** files in this repo (`.mcp.json`, `config/*.json`) do **not** log you in. MCP connectors that use OAuth must be authorised by you, in claude.ai, once per account.

## 1. Spline (official remote MCP) — do this before the competition
- Endpoint: `https://mcp.spline.design/mcp` (Streamable HTTP, remote — no local software)
- Auth: OAuth 2.1 with a Spline account (free tier OK; feature limits are Spline's).
- Setup in claude.ai (works for Claude Code Web):
  1. claude.ai → **Settings → Connectors → Add custom connector**
  2. Name `Spline`, URL `https://mcp.spline.design/mcp` → **Add** → **Connect** → sign in to Spline and approve.
  3. Start a new Claude Code session; ask “list Spline MCP tools” to confirm.
- Tools: discovered after connecting (scene read/write per `spline:read spline:write` scopes). Record the real list in MCP_STATUS.md.
- Using output: export a scene from Spline as `.splinecode` URL and render with `@splinetool/react-spline` (add the dependency only if you use it), or export GLB → `public/assets/models/`.
- `.mcp.json` also lists Spline for the Claude Code **CLI** (it prompts `/mcp` → authenticate). Whether Claude Code Web reads repo `.mcp.json` is not guaranteed — use the claude.ai connector.

## 2. Figma (official) — already connected
- Connected via claude.ai connector. Your seat is **View**: get_design_context / screenshots work; creating files may need an editor seat.

## 3. GitHub
- Claude Code Web pushes through its built-in git proxy **only for repos attached to the session**. When starting the session at claude.ai/code, pick the repository in the repo selector. Connect GitHub under claude.ai Settings → Connectors / Claude Code GitHub app if it is not listed.

## 4. Non-MCP sources (no auth unless noted)
| Source | API | Auth | Free limits | Runs |
|---|---|---|---|---|
| Poly Haven | api.polyhaven.com | none | Fair use, CC0 | remote |
| ambientCG | ambientcg.com/api/v2 | none | CC0 | remote |
| Sketchfab | api.sketchfab.com/v3 | token for downloads | per-model licence; never paid/“Store” models | remote |
| Kenney / Quaternius | website | none | CC0 | manual browser download |
| Mixamo | website | Adobe ID | free; use inside projects, don’t redistribute raw | manual |
| Google Fonts / Lucide / LottieFiles | CDN | none (Lottie free account for some) | OFL / ISC / Lottie Simple licence | remote |

## Secrets
Put tokens in `.env` (git-ignored; template `.env.example`). Never commit keys. No secrets are stored in this repo.
