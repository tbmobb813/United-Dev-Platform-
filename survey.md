# UDP Pivot Validation Survey (Sprint 0)

Use this to create a Google Form for developer validation before Sprint 1.

## Recommended form settings

- Title: `UDP Pivot Validation Survey`
- Collect emails: optional
- Limit to 1 response: optional
- Response window: 7 days max
- Target sample: 20–30 developers

## Intro text (paste into form description)

We are pivoting UDP from an IDE-heavy direction to a cross-platform workflow
tool (CLI + sync + mobile + extension). This survey validates whether the new
direction is worth proceeding with. The survey takes ~3 minutes.

## Questions

### Q1 — Current pain level

**Question type:** Multiple choice

How painful is your current cross-device workflow for code + project context?

- Very painful
- Somewhat painful
- Neutral
- Not painful

### Q2 — Feature interest

**Question type:** Checkbox (select all)

Which capabilities would be most valuable to you?

- CLI-based project bootstrap and sync
- Real-time project sync across desktop/mobile
- VS Code extension controls for sync status
- Mobile companion for reviewing/editing synced files
- AI-assisted code/project analysis from CLI/MCP

### Q3 — Go/No-Go question (gating)

**Question type:** Multiple choice (required)

If UDP shipped this workflow tool in the next few sprints, would you actively
try it?

- Yes
- No

> Sprint 0 gate rule: proceed only if **Yes responses >= 60%** on Q3.

### Q4 — Top blocker

**Question type:** Short answer

What is the biggest concern that would stop you from adopting this workflow?

### Q5 — Platform fit

**Question type:** Multiple choice

Which environment do you primarily use?

- VS Code
- Cursor
- JetBrains IDE
- Terminal-first / Neovim / Other

### Q6 — Optional follow-up

**Question type:** Short answer (optional)

If you want to test early builds, leave your preferred contact handle.

## Distribution checklist

- Share to internal dev channels + direct outreach
- Aim for 20–30 responses
- Close responses at day 7 (or once target reached)
- Export CSV for gate evaluation

## Gate evaluation quick math

Let:

- $Y$ = number of `Yes` responses on Q3
- $N$ = number of `No` responses on Q3
- $T = Y + N$

Gate condition:

$$
\frac{Y}{T} \ge 0.60
$$

Example: if $Y=13$ and $N=7$, then $13/20=0.65$ → **Go**.
