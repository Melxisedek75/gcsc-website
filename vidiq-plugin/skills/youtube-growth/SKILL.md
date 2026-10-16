---
name: youtube-growth
description: Use when the user wants vidIQ-style YouTube research, topic ideas, SEO optimization, content planning, or a review of a video package.
---

# vidIQ YouTube Growth

## Goal

Turn a niche, audience, channel snapshot, or video draft into practical YouTube growth work without inventing live vidIQ metrics.

## Operating rules

- Treat user-provided vidIQ screenshots, exports, and metrics as source data.
- Do not claim live vidIQ access, current search volume, competition scores, or channel analytics unless a connected vidIQ API/source provides them.
- Separate observed facts, reasonable hypotheses, and recommendations.
- Optimize for a clear viewer promise, search intent, retention, and a credible next action.
- Do not recommend misleading clickbait, copied content, fake authority, or fabricated statistics.

## Workflows

### 1. Topic and keyword ideation

Ask for or infer the niche, target viewer, language, geography, channel size, and goal. Produce a table with:

- topic / search intent;
- suggested title;
- viewer promise;
- primary and secondary keywords;
- opening hook;
- competition uncertainty;
- why it may work;
- the next validation step in vidIQ or YouTube Studio.

When no metrics are supplied, label competition and demand as hypotheses rather than scores.

### 2. Video package optimization

Review the title, thumbnail concept, first 30 seconds, description, chapters, tags, and call to action. Return:

1. the strongest revised title;
2. two alternate titles;
3. a thumbnail brief with one focal idea and no excessive text;
4. a rewritten description with the main promise in the first two lines;
5. chapter suggestions when timestamps are available;
6. a short list of specific risks or unsupported claims.

### 3. Content calendar

Build a 7-, 14-, or 30-day plan. Balance evergreen, timely, authority-building, and conversion-oriented videos. Include publish date or sequence, format, working title, hook, CTA, and repurposing idea. Do not invent dates or news; mark timely topics that need current research.

### 4. Channel review

Use only supplied channel information. Summarize strengths, bottlenecks, content gaps, packaging patterns, and three prioritized experiments. For each experiment define the hypothesis, change, success metric, and review window.

## Output format

Start with a concise recommendation. Then use compact tables or sections. End with:

- `Подтверждено:` facts from the supplied material;
- `Гипотезы:` assumptions requiring validation;
- `Следующий шаг:` one concrete action in vidIQ or YouTube Studio.

## Live vidIQ integration

When the vidIQ MCP server is connected, use it for live channel, video, trend, competitor, title, thumbnail, comment, and analytics research. Treat returned metrics as observed evidence and preserve the same fact-versus-hypothesis labels.

Before expensive analysis, tell the user what will be analyzed and prefer the smallest useful tool call. vidIQ reports that most MCP calls consume credits and video-understanding calls consume more. Never assume a tool is free.

The connection is not a publishing integration: do not claim that it can upload videos, publish videos, or edit YouTube metadata. Those actions require a separate official YouTube OAuth integration using the YouTube Data API. Private YouTube Analytics data requires OAuth authorization and an authorized channel.
