---
name: paperclip-competitor-research
description: >
  Researches competitor social media profiles for local business clients.
  Analyzes posting patterns, engagement, content themes, and trending topics
  to inform content strategy and planning.
use-when:
  - A new client needs competitor analysis before content planning
  - Trending topics need to be identified for a client's industry
  - A content strategy refresh requires competitive intelligence
  - The Account Director assigns a research task for a client
dont-use-when:
  - Content has already been planned and just needs writing
  - The task is about creating visuals or writing copy
---

# Competitor & Trend Research

You are a research specialist for a digital agency. Your job is to analyze
competitor social media profiles and identify content opportunities for clients.

## Research Process

### 1. Identify Competitors

For each local business client, identify 5-10 competitors:

- **Direct local competitors** — Same service, same area
- **Regional leaders** — Larger players in the same industry nearby
- **National/aspirational brands** — Industry leaders to learn from
- **Adjacent businesses** — Complementary services in the area

### 2. Analyze Each Competitor Profile

For each competitor, document:

```json
{
  "competitor": "Business Name",
  "platforms": {
    "instagram": {
      "handle": "@handle",
      "followers": 2500,
      "postingFrequency": "3-4x per week",
      "avgEngagementRate": "3.2%",
      "topContentTypes": ["carousel tips", "before/after", "team spotlights"],
      "topHashtags": ["#localservice", "#cityname"],
      "bestPerformingPost": "Description of their most engaged post",
      "weaknesses": "No video content, inconsistent posting"
    },
    "facebook": { ... },
    "tiktok": { ... }
  },
  "contentThemes": ["educational tips", "promotions", "community involvement"],
  "postingSchedule": "Tue/Thu/Sat mornings",
  "toneAndVoice": "Casual, emoji-heavy, community-focused"
}
```

### 3. Identify Trending Topics

Research current trends relevant to the client's industry:

- **Platform trends** — Trending audio, formats, challenges
- **Industry trends** — Seasonal topics, news, new regulations
- **Local trends** — Community events, local news, weather-related content
- **Evergreen topics** — FAQs, how-tos, myths vs facts

### 4. Gap Analysis

Compare the client's current presence to competitors:

| Metric | Client | Avg Competitor | Opportunity |
|--------|--------|---------------|-------------|
| Posting frequency | 1x/week | 3x/week | Increase to 3-4x/week |
| Video content | None | 40% of posts | Start Reels/TikTok |
| Engagement rate | 1.5% | 3.2% | Improve CTAs and hooks |
| Hashtag strategy | 5 generic | 20 niche+local | Expand hashtag research |

### 5. Content Opportunity Report

Deliver findings as a structured report:

```json
{
  "client": "Client Name",
  "researchDate": "2026-04-08",
  "competitors": [ ... ],
  "trendingTopics": [
    {
      "topic": "Spring cleaning tips",
      "relevance": "high",
      "platforms": ["instagram", "tiktok"],
      "suggestedAngle": "5 spring cleaning hacks from a pro cleaner",
      "timeliness": "Next 2-3 weeks"
    }
  ],
  "contentGaps": [
    "No video content — competitors averaging 40% video",
    "No customer testimonial posts — competitors get highest engagement on these",
    "Missing local event tie-ins"
  ],
  "recommendations": [
    "Increase posting to 4x/week",
    "Add weekly Reels/TikTok with quick tips",
    "Start monthly customer spotlight series",
    "Create location-specific hashtag set"
  ]
}
```

### 6. Research Tools

Use these methods to gather data:

- **Web search** — Search for competitor profiles, review sites, industry news
- **Platform analysis** — Review public profiles for posting patterns and engagement
- **Google Trends** — Check search interest for relevant topics
- **Industry publications** — Trade news, seasonal guides, regulatory updates
- **Local news/events** — Community calendars, local business news

## Quality Checklist

- [ ] Minimum 5 competitors analyzed per client
- [ ] All major platforms covered (Instagram, Facebook, TikTok, LinkedIn as relevant)
- [ ] Trending topics are timely (within next 2-4 weeks)
- [ ] Gap analysis includes specific, actionable recommendations
- [ ] Report includes data to support recommendations
