---
name: paperclip-escalation
description: >
  Handles escalation when an agent is stuck, blocked, or encounters an issue
  that requires human intervention or a different agent's expertise. Implements
  the Paperclip escalation protocol.
use-when:
  - The agent is stuck and cannot make progress
  - A task requires permissions or access the agent does not have
  - The agent encounters ambiguous requirements that need human clarification
  - An error persists after reasonable retry attempts
dont-use-when:
  - The agent can resolve the issue independently
  - The blocker is a transient error that can be retried
---

# Paperclip Escalation Protocol

You are an agent that needs to escalate a blocker to the Paperclip company.

## Environment Variables

- `PAPERCLIP_API_URL` — Base URL of the Paperclip server
- `PAPERCLIP_AGENT_TOKEN` — JWT bearer token for authentication
- `PAPERCLIP_COMPANY_ID` — The company this agent belongs to
- `PAPERCLIP_AGENT_ID` — This agent's unique identifier

## When to Escalate

Escalate when you encounter any of the following:

1. **Ambiguous requirements** — The issue description is unclear or contradictory.
2. **Missing access** — You need credentials, API keys, or permissions you don't have.
3. **Architectural decisions** — The task requires a design choice that could have
   significant downstream impact.
4. **Repeated failures** — A build, test, or deployment fails after 3 attempts
   with different approaches.
5. **Scope creep** — The task is significantly larger than described and needs
   re-scoping.
6. **Conflicting priorities** — Two assigned tasks or directives contradict each other.

## Escalation Steps

1. **Document the blocker clearly**:
   - What you were trying to do
   - What went wrong (include error messages/logs)
   - What you already tried
   - What you think the resolution might be

2. **Post escalation comment** — `POST /api/companies/{companyId}/issues/{issueId}/comments`
   ```json
   {
     "agentId": "<your-agent-id>",
     "type": "escalation",
     "body": "## Blocked: [Short description]\n\n**What I tried:**\n- ...\n\n**Error/Issue:**\n```\n...\n```\n\n**Suggested resolution:**\n- ...",
     "severity": "low" | "medium" | "high" | "critical"
   }
   ```

3. **Update issue status** — `PATCH /api/companies/{companyId}/issues/{issueId}`
   ```json
   {
     "status": "blocked",
     "blockedReason": "Short description of blocker"
   }
   ```

4. **Update heartbeat** — Set your status to `blocked` in the next heartbeat so
   the orchestrator knows you are available for reassignment.

5. **Request approval if needed** — `POST /api/companies/{companyId}/approvals`
   ```json
   {
     "requestedBy": "<your-agent-id>",
     "issueId": "<issue-id>",
     "type": "human_review" | "budget_increase" | "scope_change" | "access_request",
     "description": "What needs to be approved and why"
   }
   ```

## Severity Guidelines

- **low** — Nice-to-have clarification; agent can continue with best guess.
- **medium** — Agent is blocked but other tasks can proceed.
- **high** — Agent is fully blocked; no productive work can be done.
- **critical** — Data loss risk, security issue, or production incident.
