# MCP Status (tested 2026-10-31, Claude Code Web session)

| Integration | Type | Status | Evidence |
|---|---|---|---|
| **Figma** | Remote MCP (claude.ai connector) | ✅ Connected & tested | `whoami` returned your account. Seat = **View** on Starter: reading designs works, writing may be blocked. |
| **Google Drive / Slides** | Remote MCP (claude.ai connector) | ✅ Enabled in session (not exercised) | Listed `enabledInChat: true`. |
| **Spline** | Remote MCP `https://mcp.spline.design/mcp` | ⚠️ Live, **not connected** | `initialize` → HTTP 401 with OAuth metadata (DCR + PKCE, scopes `spline:read spline:write`). Needs your login — see MCP_SETUP.md. |
| **GitHub** | Built-in git proxy / plugin MCP | ❌ Not available this session | GitHub MCP plugin failed (session not bound to a repo); `list_repos` said no GitHub account linked. |
| Adobe, Higgsfield, Imagine Art | claude.ai connectors | ❌ Need reconnect | `connect_incomplete` / `needs_reconnect`. Not needed for this project. |
| Poly Haven, ambientCG, Khronos, Fontsource, Lucide | **Public REST APIs (not MCP)** | ✅ Working | 25/25 manifest entries downloaded by `scripts/download-assets.ts`. |
| Sketchfab | REST API (not MCP) | 🔶 Search works; download needs your token | `scripts/discover-assets.ts` lists CC0/CC-BY downloadable models. |
| Kenney | Website | ❌ 403 to automated requests | Download manually in a browser if needed. |
| Quaternius, Mixamo | Websites | Manual | One Quaternius model (RobotExpressive, CC0) is included. Mixamo needs Adobe login. |
| Awwwards, Godly, SiteInspire, Land-book | Websites | Manual browsing | No API/MCP. Notes in `design-references/`. |

Nothing above is claimed as connected unless a call succeeded.
