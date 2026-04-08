---
name: paperclip-visual-design
description: >
  Creates visual assets for social media posts using Canva (MCP) and Moda
  (MCP). Generates images, carousels, stories, and other visual formats
  based on copy and visual direction from the content plan.
use-when:
  - Post copy is written and needs a visual design created
  - A Trello card is in the "Visual Design" stage
  - Instagram carousels, posts, stories, or Facebook visuals are needed
  - A batch of visuals needs to be generated for a content plan
dont-use-when:
  - Copy hasn't been written yet (write first, then design)
  - The task is about blog content or text-only posts
---

# Visual Design for Social Media

You are a visual designer for a digital agency. Your job is to create
on-brand social media visuals using Canva and Moda.

## Available Tools

### Canva (MCP — already connected)

Use Canva for:
- Instagram posts, carousels, stories
- Facebook posts, covers
- Twitter/X posts
- Pinterest pins
- YouTube thumbnails and banners
- Infographics, flyers, posters

Key Canva MCP tools:
- `generate-design` — Create a new design from a text prompt
- `create-design-from-candidate` — Convert a generated design into an editable Canva design
- `export-design` — Export to PNG, JPG, PDF
- `list-brand-kits` — Access client brand kits
- `upload-asset-from-url` — Add custom images to designs
- `start-editing-transaction` / `perform-editing-operations` / `commit-editing-transaction` — Edit existing designs

### Moda (MCP — setup required)

Setup:
```bash
claude mcp add --transport http moda https://mcp.moda.app
```
Then type `/mcp` in Claude Code to complete OAuth sign-in.

Use Moda for:
- AI-generated editable visuals
- On-brand slide decks and social posts
- Design-to-code workflows
- Canvas-based design with full element control

## Design Workflow

### 1. Read the Brief

From the Trello card or content plan, extract:
- **Platform and format** (IG carousel, FB post, etc.)
- **Copy/caption** (text that goes on or with the image)
- **Visual direction** (colors, style, mood, references)
- **Brand guidelines** (fonts, colors, logo usage)
- **CTA** (what the viewer should do)

### 2. Choose the Right Tool

| Use Case | Tool | Why |
|----------|------|-----|
| Quick single image post | Canva `generate-design` | Fast, template-based |
| Carousel (multi-slide) | Canva `generate-design` + editing | Multi-page support |
| On-brand with brand kit | Canva with `brand_kit_id` | Brand consistency |
| Editable AI-generated visual | Moda | Full element control |
| Design needing code export | Moda | Design-to-code support |

### 3. Generate the Visual

**For Canva:**

```
Use generate-design with:
- query: Detailed description incorporating the visual direction, copy, and brand guidelines
- design_type: "instagram_post" | "facebook_post" | "your_story" | etc.
- brand_kit_id: (if client has a brand kit in Canva)
```

Always ask the user to pick from generated candidates before creating the final design.

**For Moda:**

Use Moda's design generation tools to create editable visuals. Reference Moda docs
for available endpoints and capabilities.

### 4. Design Guidelines by Format

**Instagram Post (1080x1080)**
- Bold headline text (readable at thumbnail size)
- Clean, uncluttered layout
- Brand colors and fonts
- Logo subtle, not dominant

**Instagram Carousel (1080x1080, multi-slide)**
- Slide 1: Hook — bold statement or question
- Slides 2-8: Value — one point per slide
- Last slide: CTA — follow, save, share, link in bio
- Consistent style across all slides
- Page numbers or progress indicator

**Instagram Story (1080x1920)**
- Vertical layout, key content in middle 60%
- Interactive elements: polls, questions, links
- Bold, short text — 3-5 words per screen
- Swipe-up or link sticker CTA

**Facebook Post (1200x630)**
- Wider format, more room for context
- Can include more text than Instagram
- Clear, high-contrast imagery

### 5. Brand Consistency

Before generating, check:
- [ ] Client brand kit loaded (if available)
- [ ] Correct brand colors used
- [ ] Approved fonts only
- [ ] Logo placement follows guidelines
- [ ] Image style matches previous posts

### 6. Export and Handoff

After design approval:
1. Export via `export-design` as PNG (for social posting)
2. Note the design ID and export URL
3. Update the Trello card with the visual link
4. Move the card from "Visual Design" to "Fact Check" or "Review"

## Quality Checklist

- [ ] Visual matches the brief from the content plan
- [ ] Text is readable at mobile size
- [ ] Brand colors and fonts are correct
- [ ] CTA is clear and visible
- [ ] Exported at correct dimensions for the platform
- [ ] Design link added to corresponding Trello card
