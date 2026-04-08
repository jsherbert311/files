# Digital Agency — Paperclip Automation Profile

This repository is configured for [Paperclip](https://github.com/paperclipai/paperclip) — an open-source orchestration platform that coordinates AI agents to automate your digital agency operations.

## What This Agency Does

We help local businesses with:
- **Social media content creation** — Posts, captions, hashtags, content batches
- **Social media management** — Scheduling, engagement monitoring, performance reporting
- **CRM & AI automations** — Lead nurture, email sequences, booking workflows, review management
- **Blog content** — SEO-optimized posts, keyword research, content calendars

## Quick Start

### 1. Install & Start Paperclip

```bash
npx paperclipai onboard --yes
npx paperclipai run
```

Dashboard at `http://localhost:3100`. Uses your Claude Max subscription — no separate API key needed.

### 2. Connect Your Agent

```bash
npx paperclipai agent local-cli <agentRef>
```

### 3. Connect MCP Integrations

**Moda** (primary visual design tool):
```bash
claude mcp add --transport http moda https://mcp.moda.app
```
Then type `/mcp` in Claude Code to complete OAuth sign-in.

**Trello** (content pipeline management):
```bash
git clone https://github.com/kocakli/trello-desktop-mcp.git
cd trello-desktop-mcp && npm install && npm run build
claude mcp add trello -- node /path/to/trello-desktop-mcp/dist/index.js \
  -e TRELLO_API_KEY=your-key \
  -e TRELLO_TOKEN=your-token
```
Get credentials at https://trello.com/app-key

**Canva** — Already connected as MCP tool (secondary design option).

**Publer** — REST API integration (Business or Enterprise plan required).
Set `PUBLER_API_KEY` in your environment. Each client has their own Publer workspace.

### 4. Environment Setup

Copy `.paperclip/env.example` to `.env` and fill in your values.

## Content Pipeline

```
Research → Plan → Write → Design (Moda) → Fact Check → YOUR QA → Publer
```

| Stage | Agent | Trello List | What Happens |
|-------|-------|-------------|-------------|
| 1. Research | Competitor Analyst | Backlog | Analyze competitor profiles, find trending topics |
| 2. Plan | Content Strategist | This Week | Build content calendar, create Trello cards |
| 3. Write | Content Writer | Writing | Write post copy, captions, hashtags |
| 4. Design | Visual Designer | Visual Design | Create visuals in Moda |
| 5. Fact Check | Fact Checker | Fact Check | Verify claims, flag issues |
| 6. **Your QA** | **You (human)** | **Your Review** | **You approve or request changes** |
| 7. Schedule | Publishing Agent | Scheduled | Push to correct Publer workspace |
| 8. Live | Publishing Agent | Posted | Post is published |

**You are the gatekeeper at Stage 6.** Nothing goes to Publer without your approval.

## Project Structure

```
.claude/skills/
  paperclip-heartbeat/SKILL.md            — Server check-in protocol
  paperclip-task-checkout/SKILL.md        — Pick up and start issues
  paperclip-result-report/SKILL.md        — Submit completed work for review
  paperclip-escalation/SKILL.md           — Escalate blockers
  paperclip-competitor-research/SKILL.md  — Competitor analysis & trend research
  paperclip-content-planning/SKILL.md     — Content calendars & Trello card creation
  paperclip-social-content/SKILL.md       — Social media copywriting
  paperclip-blog-content/SKILL.md         — SEO blog writing (when needed)
  paperclip-visual-design/SKILL.md        — Moda & Canva visual creation
  paperclip-fact-checking/SKILL.md        — Content accuracy verification
  paperclip-trello-workflow/SKILL.md      — Trello pipeline management
  paperclip-publer-scheduling/SKILL.md    — Publer workspace scheduling
  paperclip-crm-automation/SKILL.md       — CRM workflows & automations (when needed)

.paperclip/
  company-profile.json                    — Agency profile with agents, workflow & routines
  env.example                             — Environment variable template
```

## Agent Roles

| Role | Name | Model | Purpose |
|------|------|-------|---------|
| CEO | Account Director | claude-opus-4-6 | Pipeline oversight, delegation, weekly reports |
| Researcher | Competitor Analyst | claude-sonnet-4-6 | Competitor profiles, trending topics, gap analysis |
| Planner | Content Strategist | claude-sonnet-4-6 | Content calendars, Trello cards |
| Content Creator | Content Writer | claude-sonnet-4-6 | Social media posts, captions, hashtags |
| Visual Designer | Visual Designer | claude-sonnet-4-6 | Moda & Canva social media graphics |
| Fact Checker | Fact Checker | claude-sonnet-4-6 | Claim verification, source checking |
| Publisher | Publishing Agent | claude-sonnet-4-6 | Publer scheduling after your QA approval |

## Automated Routines

| Routine | Schedule | Agent | What It Does |
|---------|----------|-------|--------------|
| Morning Briefing | 8am M-F | Account Director | Review Trello boards, flag overdue items |
| Competitor Research | 9am Mon | Competitor Analyst | Weekly competitor & trend analysis |
| Content Planning | 10am Mon | Content Strategist | Build weekly plan, create Trello cards |
| Content Batch | 9am Tue/Thu | Content Writer | Write copy for all posts in pipeline |
| Visual Batch | 11am Tue/Thu | Visual Designer | Create Moda graphics for posts |
| Fact Check Sweep | 2pm Tue/Thu | Fact Checker | Verify all content in fact check queue |
| Publish Approved | 10am Wed/Fri | Publishing Agent | Schedule your approved posts to Publer |
| Weekly Client Report | 4pm Fri | Account Director | Compile weekly performance summaries |

## Useful Commands

```bash
npx paperclipai doctor              # Diagnose setup issues
npx paperclipai configure           # Update configuration
npx paperclipai company list        # List companies
npx paperclipai agent list          # List agents
npx paperclipai plugin install <pkg> # Install a plugin
```
