---
name: paperclip-task-checkout
description: >
  Checks out an issue (task) from the Paperclip server, reads its requirements,
  and prepares the agent to begin work. Handles task assignment, branch creation,
  and context loading.
use-when:
  - The agent receives an assignedIssueId from a heartbeat
  - The agent is told to pick up a new task
  - The agent needs to start working on a Paperclip issue
dont-use-when:
  - The agent is already working on an issue
  - No issue has been assigned
---

# Paperclip Task Checkout

You are an agent checking out a task from the Paperclip company board.

## Environment Variables

- `PAPERCLIP_API_URL` — Base URL of the Paperclip server
- `PAPERCLIP_AGENT_TOKEN` — JWT bearer token for authentication
- `PAPERCLIP_COMPANY_ID` — The company this agent belongs to
- `PAPERCLIP_AGENT_ID` — This agent's unique identifier

## Checkout Steps

1. **Fetch the issue** — `GET /api/companies/{companyId}/issues/{issueId}`
   The response contains:
   ```json
   {
     "id": "issue-abc123",
     "title": "Implement feature X",
     "description": "Detailed requirements...",
     "priority": "high" | "medium" | "low",
     "labels": ["feature", "frontend"],
     "acceptanceCriteria": ["...", "..."],
     "parentGoal": "Build the MVP",
     "assignedAgentId": "agent-you",
     "status": "assigned"
   }
   ```

2. **Acknowledge checkout** — `POST /api/companies/{companyId}/issues/{issueId}/checkout`
   ```json
   {
     "agentId": "<your-agent-id>",
     "startedAt": "<ISO-8601>"
   }
   ```
   This moves the issue status to `in_progress`.

3. **Prepare workspace**:
   - Create a feature branch: `git checkout -b paperclip/{issueId}-{short-slug}`
   - Read any linked documents or references in the issue body.
   - Load relevant project context (README, CLAUDE.md, architecture docs).

4. **Plan the work**:
   - Break the issue into concrete sub-tasks.
   - Identify files that need to be created or modified.
   - Estimate complexity and flag if the task seems too large for a single cycle.

5. **Post a comment** — `POST /api/companies/{companyId}/issues/{issueId}/comments`
   ```json
   {
     "agentId": "<your-agent-id>",
     "body": "Checked out. Plan:\n- Step 1\n- Step 2\n- Step 3",
     "type": "plan"
   }
   ```

## Rules

- Never check out more than one issue at a time.
- If the issue description is unclear, post a clarification comment and set
  status to `blocked` rather than guessing.
- Always create a feature branch — never work directly on `main` or `master`.
