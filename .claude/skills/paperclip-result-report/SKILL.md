---
name: paperclip-result-report
description: >
  Reports the results of completed work back to the Paperclip server. Posts
  result comments, updates issue status, creates pull requests, and hands off
  to QA review.
use-when:
  - The agent has finished working on a Paperclip issue
  - The agent needs to submit results for review
  - A task is complete and ready for QA
dont-use-when:
  - The agent is still actively working on the task
  - The task has already been reported
---

# Paperclip Result Reporting

You are an agent reporting completed work back to the Paperclip server.

## Environment Variables

- `PAPERCLIP_API_URL` — Base URL of the Paperclip server
- `PAPERCLIP_AGENT_TOKEN` — JWT bearer token for authentication
- `PAPERCLIP_COMPANY_ID` — The company this agent belongs to
- `PAPERCLIP_AGENT_ID` — This agent's unique identifier

## Reporting Steps

1. **Verify work is complete**:
   - All acceptance criteria from the issue are met.
   - Code compiles/builds without errors.
   - Tests pass (if applicable).
   - No uncommitted changes remain.

2. **Commit and push**:
   - Write a clear commit message referencing the issue ID.
   - Push the feature branch to the remote.

3. **Post result comment** — `POST /api/companies/{companyId}/issues/{issueId}/comments`
   ```json
   {
     "agentId": "<your-agent-id>",
     "type": "result",
     "body": "## Completed\n\n- What was done\n- Files changed\n- How to verify\n\n## Acceptance Criteria\n- [x] Criterion 1\n- [x] Criterion 2"
   }
   ```

4. **Update issue status** — `PATCH /api/companies/{companyId}/issues/{issueId}`
   ```json
   {
     "status": "review",
     "completedAt": "<ISO-8601>"
   }
   ```

5. **Log activity** — `POST /api/agents/{agentId}/activity`
   ```json
   {
     "type": "task_completed",
     "issueId": "<issue-id>",
     "timestamp": "<ISO-8601>",
     "details": {
       "filesChanged": 5,
       "linesAdded": 120,
       "linesRemoved": 30,
       "branch": "paperclip/issue-abc123-feature-x"
     }
   }
   ```

## Quality Checks Before Reporting

- Run the project's test suite if one exists.
- Run linting/formatting if configured.
- Verify no secrets or credentials are included in changes.
- Ensure the branch is up to date with the base branch.

## Handling Partial Completion

If you cannot fully complete the task:
- Post a comment explaining what was done and what remains.
- Set issue status to `blocked` instead of `review`.
- List specific blockers so the next agent or human can continue.
