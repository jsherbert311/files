# Paperclip Business Automation Profile

This repository is configured for [Paperclip](https://github.com/paperclipai/paperclip) — an open-source orchestration platform for coordinating AI agents to automate business operations.

## Quick Start

### 1. Install & Start Paperclip

```bash
npx paperclipai onboard --yes
npx paperclipai run
```

The server starts at `http://localhost:3100`. Open the dashboard to create your first company using the onboarding wizard.

### 2. Configure Your Agent

After creating a company and agent in the dashboard, run:

```bash
npx paperclipai agent local-cli <agentRef>
```

This generates an API key and installs the Paperclip skills into `~/.claude/skills/`. Copy the exported environment variables into your shell or `.env` file.

### 3. Environment Setup

Copy `.paperclip/env.example` to `.env` and fill in your values:

- `PAPERCLIP_API_URL` — Server URL (default: `http://localhost:3100`)
- `PAPERCLIP_AGENT_TOKEN` — JWT token from `agent local-cli`
- `PAPERCLIP_COMPANY_ID` — From the dashboard
- `PAPERCLIP_AGENT_ID` — From the dashboard
- `ANTHROPIC_API_KEY` — Your Anthropic API key

## Project Structure

```
.claude/skills/
  paperclip-heartbeat/SKILL.md      — Heartbeat protocol (check-in with server)
  paperclip-task-checkout/SKILL.md  — Check out and start working on issues
  paperclip-result-report/SKILL.md  — Report completed work for QA review
  paperclip-escalation/SKILL.md     — Escalate blockers to humans or other agents

.paperclip/
  company-profile.json              — Company profile template with agent roles
  env.example                       — Environment variable template
```

## Agent Roles

The company profile defines four agents:

| Role | Name | Model | Purpose |
|------|------|-------|---------|
| CEO | Strategist | claude-opus-4-6 | Plans, prioritizes, delegates |
| Engineer | Builder | claude-sonnet-4-6 | Writes code, fixes bugs |
| QA | Reviewer | claude-sonnet-4-6 | Reviews work, validates quality |
| Researcher | Analyst | claude-haiku-4-5 | Market research, data analysis |

## Routines

| Routine | Schedule | Agent | Description |
|---------|----------|-------|-------------|
| Daily Standup | 9am M-F | CEO | Review and assign work |
| Weekly Review | 5pm Fri | CEO | Summarize progress |
| QA Sweep | 4pm M-F | QA | Review completed issues |

## Useful Commands

```bash
npx paperclipai doctor              # Diagnose setup issues
npx paperclipai configure           # Update configuration
npx paperclipai company list        # List companies
npx paperclipai agent list          # List agents
npx paperclipai plugin list         # List installed plugins
npx paperclipai plugin install <pkg> # Install a plugin
```
