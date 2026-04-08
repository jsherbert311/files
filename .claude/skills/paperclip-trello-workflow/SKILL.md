---
name: paperclip-trello-workflow
description: >
  Manages the content pipeline in Trello. Creates cards for individual posts
  organized by week, 8-12 weeks out. Moves cards through the production
  pipeline from content calendar to archive.
use-when:
  - Content calendar needs to be populated with new weekly cards
  - Cards need to be moved through the production pipeline
  - The pipeline needs a health check (are we 4+ weeks ahead?)
  - A batch of posts is ready to be organized in Trello
dont-use-when:
  - The task is about creating content or visuals (create first, then update card)
  - Content hasn't been planned yet
---

# Trello Content Pipeline

You are a workflow manager for a digital agency (That Social Geek). Your job is
to keep content organized in Trello so every client always has at least 4 weeks
of content planned ahead.

## Prerequisites

Trello MCP server must be connected. Setup:

```bash
git clone https://github.com/kocakli/trello-desktop-mcp.git
cd trello-desktop-mcp && npm install && npm run build
claude mcp add trello -- node /path/to/trello-desktop-mcp/dist/index.js \
  -e TRELLO_API_KEY=your-key \
  -e TRELLO_TOKEN=your-token
```

Get credentials at https://trello.com/app-key

## Board Structure

Each client has their own Trello board with these lists:

| List | Purpose |
|------|---------|
| **Content Calendar** | Future content organized by week (8-12 weeks out). Each card is labeled by week (e.g., "Week 1 - Apr 06-Apr 11"). 4 posts per week per account. |
| **Fact Check** | Cards move here BEFORE production. Fact Checker verifies claims, topics, and compliance per the client profile. Prevents wasted work on non-compliant content. |
| **In Production** | A fact-checked card has been picked up by an agent or team member to create content (writing copy, designing visuals in Moda). |
| **In Review** | Content is fully produced (copy + visuals) and waiting for Jason's review. |
| **Approved** | Jason has reviewed and approved the content. Ready for Publer. |
| **Published** | Content has been added to Publer and is scheduled or posted. |
| **Archive** | Previous weeks' published content. Moved here weekly to keep the board clean. |

## Content Calendar Structure

Content is planned **8 to 12 weeks ahead**. Each week has **4 posts per client**.

### Card Naming Convention

Cards in the Content Calendar are grouped by week:

```
Week [#] - [Date Range]
```

Example weeks:
- Week 1 - Apr 06-Apr 11
- Week 2 - Apr 13-Apr 18
- Week 3 - Apr 20-Apr 25

### Card Structure

Each card represents one social media post. The same post content is used
across all platforms the account is set up on (Instagram, Facebook, etc.).

**Card Title**: `Week [#] | [Format] — [Short Topic]`
Examples:
- `Week 5 | Image — Spring cleaning tips for homeowners`
- `Week 5 | Carousel — 5 signs your child may have ADHD`
- `Week 5 | Video — Day in the life at the office`
- `Week 5 | Image — Client testimonial spotlight`

**Card Description** (use this template):

```markdown
## Post Details
- **Client:** [Client Name]
- **Week:** Week [#] - [Date Range]
- **Platforms:** Instagram, Facebook, Google Business (whichever the account uses)
- **Format:** Image / Carousel / Video / Reel
- **Content Pillar:** [From client profile]

## Caption/Copy
[Full post caption — same copy used across all platforms unless platform
rules in the client profile say otherwise]

## Hashtags
[Platform-appropriate hashtags]

## Visual Direction
[Description for Moda designer — colors, style, text overlay, image ideas]
[For video: shot list, voiceover script, B-roll suggestions]

## CTA
[Approved CTA from client profile]

## SEO Keywords
[From client profile's local SEO requirements]

## Notes
- [ ] Image/Carousel: Auto-create in Moda
- [ ] Video: Requires manual production
```

**Labels** (color-coded by format):
- Green = Image Post
- Blue = Carousel
- Orange = Video/Reel
- Purple = Story

## Workflow Rules

### Populating the Content Calendar

The agents' primary job is to keep the Content Calendar stocked **at least 4 weeks ahead** for every client.

1. **Check current depth** — How many weeks of content exist for each client?
2. **If under 4 weeks** — Research trending topics, check client pillars, and create new cards
3. **Create 4 cards per week** — Mix of formats per the client profile (e.g., 2 Videos + 1 Image + 1 Carousel for Week A)
4. **Follow pillar rotation** — No pillar repeated in the same week, no pillar back-to-back across weeks
5. **Reference the client profile** — Read `.paperclip/clients/[client-name].md` for tone, compliance, pillars, and SEO keywords

### Moving Cards Through the Pipeline

| From | To | Who | Trigger |
|------|----|-----|---------|
| Content Calendar | Fact Check | Content Strategist | New cards created, ready for compliance check |
| Fact Check | In Production | Fact Checker | Claims and topics verified, cleared for production |
| In Production | In Review | Agent or team member | Content (copy + visuals) is complete on the card |
| In Review | Approved | **Jason (human)** | Jason reviews and approves |
| Approved | Published | Publishing Agent | Content is added to Publer |
| Published | Archive | Any agent | Previous week's content is archived |

### Auto-Creation Rules

- **Image posts** — Agent picks up card, writes copy, creates visual in Moda, moves to In Review
- **Carousel posts** — Agent picks up card, writes copy, creates all slides in Moda, moves to In Review
- **Video posts** — Agent writes the script, voiceover, and B-roll suggestions on the card, but the card stays in In Production until video is manually produced. Agent adds a comment noting "Video script ready — needs manual production."

### Cross-Platform Posting

The same post content is used across all platforms the client is on, unless the
client profile specifies different rules per platform. For example:
- Three Arrows: Facebook gets no emojis, Instagram gets 0-2 max
- Google Business posts always include full NAP (name, address, phone, website)

When the card reaches Publer, the Publishing Agent creates the post for each
connected platform in that client's Publer workspace.

### Weekly Archive Routine

Every Monday morning:
1. Move all cards from **Published** to **Archive** for the previous week
2. Check that the current week has 4 cards in **Content Calendar** or further in the pipeline
3. Flag any clients with fewer than 4 weeks of content ahead

### Daily Pipeline Check

Each morning, review each client board:

1. How many weeks of content are in Content Calendar? (Target: 4+ weeks)
2. Are any cards stuck in In Production for more than 2 days?
3. What's in In Review waiting for Jason?
4. What's in Approved waiting to be pushed to Publer?
5. Flag any gaps or blockers

## Quality Checklist

- [ ] Every client has at least 4 weeks of content in Content Calendar
- [ ] Each week has exactly 4 posts
- [ ] Format mix follows the client profile's rotation (Week A / Week B pattern)
- [ ] Content pillars rotate correctly (no repeats within a week or back-to-back)
- [ ] Cards have full copy, hashtags, visual direction, and CTA
- [ ] Image and carousel cards have Moda visuals created before moving to In Review
- [ ] Video cards have scripts written and are flagged for manual production
- [ ] Published cards are archived weekly
