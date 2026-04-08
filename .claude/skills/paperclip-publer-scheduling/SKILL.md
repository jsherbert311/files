---
name: paperclip-publer-scheduling
description: >
  Schedules approved social media posts to Publer workspaces via the Publer API.
  Each client has their own Publer workspace. Posts are only pushed after the
  human owner completes QA and marks them as approved.
use-when:
  - Approved content needs to be scheduled in Publer
  - Posts have passed QA and are ready to publish
  - A batch of approved posts needs to be pushed to a specific client workspace
  - Post scheduling status needs to be checked
dont-use-when:
  - Content hasn't been QA-approved yet (wait for human approval)
  - The task is about creating content or visuals
  - The task is about Trello pipeline management (use trello-workflow)
---

# Publer Scheduling

You are a publishing specialist for a digital agency. Your job is to take
QA-approved social media content and schedule it in the correct Publer
workspace for each client.

## Prerequisites

**Publer Business or Enterprise plan** required for API access.

**API Key**: Generate at Publer > Settings > API Keys

**Environment variables needed:**
```
PUBLER_API_KEY=your-api-key
```

**Base URL:** `https://app.publer.com/api/v1/`

## Authentication

Every request requires two headers:

```
Authorization: Bearer-API YOUR_API_KEY
Publer-Workspace-Id: YOUR_WORKSPACE_ID
Content-Type: application/json
```

Each client has their own Publer workspace. Map client names to workspace IDs
in your configuration.

## Workflow: Trello Approved List → Publer

**The Trello "Approved" list IS the trigger.** The flow is:

1. Content moves through the pipeline: Content Calendar → Fact Check → In Production → In Review
2. Content lands in the **"In Review"** list on Trello
3. **Jason reviews the card in Trello**
4. Jason moves the card to the **"Approved"** list — this IS the QA approval
5. The Publishing Agent detects cards in the Approved list and pushes them to Publer
6. Card moves to **"Published"** in Trello

**How to detect approved cards:**
- Use the Trello MCP to check the "Approved" list on each client board
- Any card in the Approved list that hasn't been pushed to Publer yet is ready to go
- After pushing to Publer, move the card to "Published" and add a comment confirming

The agent should **never** publish content from any list other than "Approved".

## API Operations

### List Workspaces

```
GET /workspaces
```

Returns all workspaces. Use this to map client names to workspace IDs.

### List Social Accounts in a Workspace

```
GET /accounts
Headers: Publer-Workspace-Id: {workspace_id}
```

Returns connected social accounts (Instagram, Facebook, TikTok, etc.).

### Schedule a Post

```
POST /posts/schedule
Headers:
  Authorization: Bearer-API {api_key}
  Publer-Workspace-Id: {workspace_id}
  Content-Type: application/json

Body:
{
  "bulk": {
    "state": "scheduled",
    "posts": [
      {
        "facebook": {
          "type": "photo",
          "text": "Your caption here with #hashtags\n\nCTA here"
        }
      },
      {
        "instagram": {
          "type": "photo",
          "text": "Your caption here with #hashtags\n\nCTA here"
        }
      }
    ],
    "accounts": ["account_id_1", "account_id_2"],
    "scheduled_at": "2026-04-10T09:00:00Z",
    "media_urls": ["https://url-to-exported-visual.png"]
  }
}
```

**Post types:** `photo`, `video`, `carousel`, `text`, `reel`, `story`

### Schedule a Carousel

```json
{
  "bulk": {
    "state": "scheduled",
    "posts": [
      {
        "instagram": {
          "type": "carousel",
          "text": "Caption for carousel post"
        }
      }
    ],
    "accounts": ["instagram_account_id"],
    "scheduled_at": "2026-04-10T09:00:00Z",
    "media_urls": [
      "https://slide1.png",
      "https://slide2.png",
      "https://slide3.png"
    ]
  }
}
```

### Check Post Status

The schedule endpoint returns a `job_id`. Poll for status:

```
GET /posts/status/{job_id}
```

### Save as Draft (alternative)

If you want the human to review in Publer before publishing:

```json
{
  "bulk": {
    "state": "draft",
    ...
  }
}
```

## Client → Workspace Mapping

Maintain a mapping of clients to their Publer workspace IDs:

```json
{
  "clients": [
    {
      "name": "Joe's Pizza",
      "publerWorkspaceId": "ws_abc123",
      "accounts": {
        "instagram": "acct_ig_001",
        "facebook": "acct_fb_001"
      }
    },
    {
      "name": "Austin Plumbing",
      "publerWorkspaceId": "ws_def456",
      "accounts": {
        "instagram": "acct_ig_002",
        "facebook": "acct_fb_002",
        "tiktok": "acct_tt_002"
      }
    }
  ]
}
```

Store this in `.paperclip/client-workspaces.json` and reference it when
scheduling posts.

## Scheduling Process

For each approved Trello card:

1. **Read the card** — Extract client name, platform, copy, hashtags, visual URL, scheduled date/time
2. **Look up workspace** — Find the client's Publer workspace ID and account IDs
3. **Export the visual** — If using Canva, export via `export-design` to get a PNG URL
4. **Build the API payload** — Map platform, post type, copy, media, and schedule time
5. **Schedule the post** — `POST /posts/schedule` with the correct workspace header
6. **Verify** — Check the job status to confirm scheduling succeeded
7. **Update Trello** — Move card to "Scheduled", add comment with Publer confirmation
8. **Log** — Record the scheduled post for the weekly client report

## Error Handling

- If the API returns 401 → API key is invalid or expired
- If the API returns 403 → Workspace ID is wrong or you lack access
- If media upload fails → Re-export the visual and retry
- If scheduling fails → Save as draft and flag for human review

## Quality Checklist

- [ ] Post has been QA-approved by the human owner
- [ ] Correct Publer workspace is targeted for the client
- [ ] Correct social accounts are selected
- [ ] Visual is exported and accessible via URL
- [ ] Caption and hashtags match the approved Trello card
- [ ] Scheduled date/time matches the content plan
- [ ] Post status confirmed as scheduled (not failed)
- [ ] Trello card updated with scheduling confirmation
