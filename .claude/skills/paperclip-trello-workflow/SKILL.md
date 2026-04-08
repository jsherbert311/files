---
name: paperclip-trello-workflow
description: >
  Manages the content pipeline in Trello. Creates cards for individual posts
  with copy, visual direction, and scheduling details. Moves cards through
  workflow stages from draft to published.
use-when:
  - Content plan posts need to be added to Trello as individual cards
  - Cards need to be moved through the workflow pipeline
  - The content pipeline status needs to be checked or updated
  - A batch of posts is ready to be organized in Trello
dont-use-when:
  - Content hasn't been written yet (write first, then add to Trello)
  - The task is about creating content or visuals
---

# Trello Content Pipeline

You are a workflow manager for a digital agency. Your job is to organize
content in Trello so nothing falls through the cracks.

## Prerequisites

Trello MCP server must be connected. Setup:

```bash
# Clone and build
git clone https://github.com/kocakli/trello-desktop-mcp.git
cd trello-desktop-mcp && npm install && npm run build

# Add to Claude Code
claude mcp add trello -- node /path/to/trello-desktop-mcp/dist/index.js \
  -e TRELLO_API_KEY=your-key \
  -e TRELLO_TOKEN=your-token
```

Get credentials at https://trello.com/app-key

## Board Structure

Set up a board for each client with these lists:

| List | Purpose |
|------|---------|
| **Backlog** | Future content ideas and research topics |
| **This Week** | Content planned for the current week |
| **Writing** | Posts being written by the content agent |
| **Visual Design** | Copy done, needs Canva/Moda design |
| **Fact Check** | Content needing accuracy verification |
| **Review** | Ready for quality review |
| **Client Approval** | Sent to client for sign-off |
| **Scheduled** | Approved and scheduled for posting |
| **Posted** | Published content (archive weekly) |

## Card Structure

Each Trello card represents one social media post or blog article:

**Card Title**: `[Platform] [Date] — [Short Topic]`
Example: `[IG Carousel] Apr 8 — 5 Spring Cleaning Tips`

**Card Description** (use this template):

```markdown
## Post Details
- **Client:** [Client Name]
- **Platform:** Instagram / Facebook / TikTok / LinkedIn
- **Format:** Carousel / Single Image / Reel / Story
- **Publish Date:** 2026-04-08
- **Publish Time:** 9:00 AM

## Content Pillar
Educational / Social Proof / Behind the Scenes / Promotional / Community

## Caption/Copy
[Full post caption here]

## Hashtags
[All hashtags here]

## Visual Direction
[Description for Canva/Moda designer — colors, style, text overlay, image refs]

## CTA
[Call to action]

## Fact Check Status
- [ ] Claims verified
- [ ] Sources documented
- [ ] Superlatives reviewed
```

**Labels** (color-coded):
- Green = Approved
- Yellow = Needs revision
- Red = Blocked
- Blue = Instagram
- Purple = Facebook
- Orange = TikTok

## Workflow Actions

### Adding a Batch of Posts

When a content plan is ready, create cards for each post:

1. Use `trello_get_user_boards` to find the client's board
2. Use `get_board_details` to find the correct list
3. Use `create_card` for each post with the full template
4. Add appropriate labels for platform and status

### Moving Cards Through Pipeline

As work progresses, move cards between lists:

1. Content written → move from "Writing" to "Visual Design"
2. Visual created → move from "Visual Design" to "Fact Check"
3. Fact checked → move from "Fact Check" to "Review"
4. Reviewed → move to "Client Approval"
5. Approved → move to "Scheduled"
6. Published → move to "Posted"

Use `move_card` and `update_card` for these transitions.
Add a comment via `add_comment` each time a card moves, noting what was done.

### Daily Pipeline Check

Each morning, review the board:

1. How many cards are in each list?
2. Are any cards stuck (in the same list for 2+ days)?
3. What's due today or tomorrow?
4. Flag any blockers

## Quality Checklist

- [ ] Every post in the content plan has a corresponding Trello card
- [ ] Cards have full copy, hashtags, and visual direction
- [ ] Labels are applied for platform and status
- [ ] Due dates are set on all cards
- [ ] Cards move forward in the pipeline daily
