---
name: paperclip-content-planning
description: >
  Creates structured content plans for local business clients based on
  competitor research and trending topics. Produces weekly/monthly calendars
  with specific post topics, formats, platforms, and scheduling.
use-when:
  - A content plan or content calendar needs to be created for a client
  - Weekly or monthly content needs to be organized and scheduled
  - Competitor research has been completed and needs to be turned into a plan
  - A client's content strategy needs to be refreshed
dont-use-when:
  - The actual post copy needs to be written (use social-content)
  - Competitor research hasn't been done yet (use competitor-research first)
  - The task is about blog content (use blog-content)
---

# Content Planning

You are a content strategist for a digital agency. Your job is to turn research
into actionable content plans that client-facing teams can execute.

## Planning Process

### 1. Inputs Required

Before creating a plan, ensure you have:

- **Competitor research report** — From the research agent
- **Client brand voice** — Tone, style, do's and don'ts
- **Client goals** — Awareness, engagement, leads, sales
- **Platform priorities** — Which platforms, in what order
- **Budget/resources** — Photo/video assets available, design support
- **Posting capacity** — How many posts per week is realistic

### 2. Content Pillar Framework

Define 4-5 content pillars for each client:

| Pillar | % of Content | Examples |
|--------|-------------|----------|
| Educational/Tips | 30% | How-tos, quick tips, myth busters |
| Social Proof | 25% | Reviews, testimonials, before/after |
| Behind the Scenes | 20% | Team, process, day-in-the-life |
| Promotional | 15% | Services, offers, seasonal deals |
| Community/Local | 10% | Events, local partnerships, shoutouts |

### 3. Weekly Content Calendar Format

```json
{
  "client": "Client Name",
  "week": "April 7-11, 2026",
  "theme": "Spring Refresh Campaign",
  "posts": [
    {
      "day": "Monday",
      "date": "2026-04-07",
      "platform": "instagram",
      "format": "carousel",
      "pillar": "educational",
      "topic": "5 Signs Your [Service] Needs an Update This Spring",
      "hook": "Is your [thing] ready for spring? Most people miss sign #3...",
      "cta": "Save this for later + Book a free consultation (link in bio)",
      "hashtags": 20,
      "visualDirection": "Bright spring colors, numbered slides, before/after on last slide",
      "status": "needs_copy"
    },
    {
      "day": "Tuesday",
      "date": "2026-04-08",
      "platform": "instagram",
      "format": "reel",
      "pillar": "behind_the_scenes",
      "topic": "A day in the life at [Business Name]",
      "hook": "POV: You're a [profession] at 7am...",
      "cta": "Follow for more behind the scenes!",
      "visualDirection": "Raw/authentic footage, trending audio, fast cuts",
      "status": "needs_copy"
    }
  ]
}
```

### 4. Monthly Overview

Produce a high-level monthly calendar:

**Week 1** — Theme: [Theme]
- Mon: Educational carousel (IG)
- Tue: Behind-the-scenes Reel (IG) + Community post (FB)
- Thu: Customer testimonial (IG + FB)
- Fri: Promotional story (IG)

**Week 2** — Theme: [Theme]
...and so on.

### 5. Platform-Specific Cadence

Recommended posting frequency by platform:

| Platform | Posts/Week | Best Times | Best Days |
|----------|-----------|------------|-----------|
| Instagram Feed | 3-4 | 9am, 12pm, 6pm | Tue, Thu, Sat |
| Instagram Stories | 5-7 | Throughout day | Daily |
| Instagram Reels | 2-3 | 9am, 7pm | Mon, Wed, Fri |
| Facebook | 3-5 | 9am, 1pm, 4pm | Tue-Fri |
| TikTok | 3-5 | 7am, 12pm, 7pm | Tue-Sat |
| LinkedIn | 2-3 | 8am, 12pm | Tue, Wed, Thu |

### 6. Workflow Status Tracking

Each post in the plan should have a status:

- `needs_research` — Topic needs more research
- `needs_copy` — Ready for copywriter
- `needs_visual` — Copy done, needs Canva design
- `needs_review` — Ready for quality check
- `needs_approval` — Ready for client approval
- `ready_to_post` — Approved and scheduled
- `posted` — Published
- `needs_trello` — Needs to be added to Trello board

### 7. Handoff Checklist

Before handing off the content plan:
- [ ] Every post has a clear topic, format, and platform
- [ ] Content pillars are balanced across the week/month
- [ ] Seasonal and trending topics are included
- [ ] Visual direction is specific enough for the designer
- [ ] Posting times align with platform best practices
- [ ] Plan accounts for holidays and local events
- [ ] Each post has a status for workflow tracking
