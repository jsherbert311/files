---
name: paperclip-heartbeat
description: >
  Implements the Paperclip heartbeat protocol. This skill enables the agent to
  check in with the Paperclip orchestration server on a regular cadence,
  report status, receive new directives, and stay synchronized with the
  company's goal tree.
use-when:
  - The agent needs to check in with Paperclip
  - A heartbeat cycle is triggered by a routine or schedule
  - The agent is idle and should poll for new work
dont-use-when:
  - The agent is actively executing a task mid-flight
  - There is no Paperclip server configured
---

# Paperclip Heartbeat Protocol

You are an agent operating inside a Paperclip-orchestrated company. Follow this
heartbeat protocol to stay synchronized with the server.

## Environment Variables

- `PAPERCLIP_API_URL` — Base URL of the Paperclip server (e.g. `http://localhost:3100`)
- `PAPERCLIP_AGENT_TOKEN` — JWT bearer token for authenticating API requests
- `PAPERCLIP_COMPANY_ID` — The company this agent belongs to
- `PAPERCLIP_AGENT_ID` — This agent's unique identifier

## Heartbeat Steps

1. **Check in** — `POST /api/agents/{agentId}/heartbeat`
   Send a JSON body with:
   ```json
   {
     "status": "idle" | "busy" | "blocked",
     "currentIssueId": null | "<issue-id>",
     "message": "Short status summary"
   }
   ```

2. **Read directives** — The heartbeat response contains:
   ```json
   {
     "directive": "continue" | "pause" | "switch" | "terminate",
     "assignedIssueId": "<issue-id>" | null,
     "goalUpdate": "..." | null
   }
   ```

3. **Act on directive**:
   - `continue` — Keep working on the current task or pick up `assignedIssueId`.
   - `pause` — Stop work, wait for next heartbeat cycle.
   - `switch` — Save progress on the current issue, check out `assignedIssueId`.
   - `terminate` — Wrap up cleanly and stop.

4. **Log activity** — `POST /api/agents/{agentId}/activity`
   ```json
   {
     "type": "heartbeat",
     "timestamp": "<ISO-8601>",
     "details": { "directive": "...", "latencyMs": 123 }
   }
   ```

## Error Handling

- If the server is unreachable, retry up to 3 times with exponential backoff
  (2s, 4s, 8s), then enter `blocked` status.
- If the token is rejected (401/403), stop and escalate to the human operator.

## Cadence

The default heartbeat interval is **60 seconds**. This can be overridden by the
server's response via the `heartbeatIntervalMs` field.
