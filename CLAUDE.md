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

### 3. Environment Setup

Copy `.paperclip/env.example` to `.env` and fill in your values.

## Project Structure

```
.claude/skills/
  paperclip-heartbeat/SKILL.md         — Server check-in protocol
  paperclip-task-checkout/SKILL.md     — Pick up and start issues
  paperclip-result-report/SKILL.md     — Submit completed work for review
  paperclip-escalation/SKILL.md        — Escalate blockers
  paperclip-social-content/SKILL.md    — Social media content creation
  paperclip-blog-content/SKILL.md      — SEO blog writing
  paperclip-crm-automation/SKILL.md    — CRM workflows & automations

.paperclip/
  company-profile.json                 — Agency profile with agent roles & routines
  env.example                          — Environment variable template
```

## Agent Roles

| Role | Name | Model | Purpose |
|------|------|-------|---------|
| CEO | Account Director | claude-opus-4-6 | Client strategy, content calendars, delegation, weekly reports |
| Content Creator | Content Writer | claude-sonnet-4-6 | Social media posts, captions, hashtags, content batches |
| Blog Writer | Blog Specialist | claude-sonnet-4-6 | SEO blog posts, keyword research, outlines |
| Automation Engineer | CRM Specialist | claude-sonnet-4-6 | CRM workflows, email sequences, lead nurture, integrations |
| Social Media Manager | Social Media Manager | claude-sonnet-4-6 | Scheduling, engagement, community management, analytics |
| QA | Quality Reviewer | claude-sonnet-4-6 | Brand consistency, grammar, SEO audit, automation testing |

## Automated Routines

| Routine | Schedule | Agent | What It Does |
|---------|----------|-------|--------------|
| Morning Briefing | 8am M-F | Account Director | Review accounts, assign daily tasks |
| Content Batch | 9am Mon/Wed | Content Writer | Generate social posts for all clients |
| Blog Drafts | 10am Tue/Thu | Blog Specialist | Research keywords, draft blog posts |
| Engagement Check | 11am M-F | Social Media Manager | Review metrics, draft responses |
| CRM Health Check | 2pm Wed | CRM Specialist | Audit automations, check workflows |
| Quality Review | 3pm M-F | Quality Reviewer | Review all content before delivery |
| Weekly Client Report | 4pm Fri | Account Director | Compile performance summaries |

## Useful Commands

```bash
npx paperclipai doctor              # Diagnose setup issues
npx paperclipai configure           # Update configuration
npx paperclipai company list        # List companies
npx paperclipai agent list          # List agents
npx paperclipai plugin install <pkg> # Install a plugin
```
