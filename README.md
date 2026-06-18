# Odyssey Compass

English | [中文版本](./README.zh-CN.md)

Chinese name: **适合我的 TA**

An AI-assisted relationship self-discovery assessment demo for young adults navigating their post-graduation Odyssey years.

The product uses structured questions and open-ended prompts to help users better understand their personality foundations, values, intimacy patterns, and ideal partner profile. It then generates four stage reports and one final relationship guide.

## Live Demo

- Vercel: [https://suitable-ta-assessment.vercel.app](https://suitable-ta-assessment.vercel.app)
- Netlify: [https://suitable-ta-assessment.netlify.app](https://suitable-ta-assessment.netlify.app)

Note: Vercel access may be less stable from mainland China, so the Netlify deployment is provided as an alternate mirror.

## Background

Many people in their twenties enter a period of uncertainty after leaving school and starting work. They are no longer following a clear academic path, and suddenly need to make their own decisions about career, city, lifestyle, relationships, and long-term partnership. This stage is often described as the "Odyssey years."

Odyssey Compass combines self-discovery and partner-fit exploration into a lightweight assessment experience. The goal is to turn vague relationship uncertainty into a readable, discussable, and actionable personal relationship guide.

## Why This Matters

- **Self-understanding without a clear method**: Young adults often want to understand what they like, what they value, and what kind of life they want, but few tools guide them through that reflection in a structured way.
- **Relationship choices without clear criteria**: Many users are not simply looking for a relationship. They are trying to understand what kind of relationship they want and what kind of partner would actually fit them.
- **Relatable content without next steps**: Social platforms have plenty of content about the Odyssey years and post-graduation anxiety, but most of it stops at emotional resonance rather than helping users decide what to do next.

## Gaps in Existing Products

- **Labels without depth**: Personality tests, dating tests, and MBTI-style products often give users a type label, but rarely explain values, partner standards, real-life constraints, or long-term compatibility in enough depth.
- **Limited actionability**: Many assessments answer "what type am I?", but do not go far enough into "why am I like this?", "what kind of relationship fits me?", or "what should I do next?"

## Product Approach

The assessment is structured around four stages:

- **Self Foundation**: Who am I? Personality foundations, energy patterns, and decision style.
- **Value Compass**: What do I value? Life priorities, values, money views, and family boundaries.
- **Intimacy Pattern**: What kind of intimacy do I want? Security needs, boundaries, communication, and repair style.
- **Ideal Partner**: Who fits me? Partner traits, real-life conditions, and relationship risks.

The question design combines rule-based and open-ended inputs:

- Multiple-choice, ranking, and scale questions produce stable scores, type signals, and stage archetypes.
- Open-ended questions capture the user's own language and personal context, leaving room for future AI-powered personalization.
- The final report goes beyond labels by adding explanations, risk signals, and next-step suggestions.

## Core Features

- Landing page with product positioning
- 68-question assessment
- Single-choice, multiple-choice, ranking, scale, and open-ended questions
- One-click demo fill for quickly walking through the full flow
- Four stage reports: Self Foundation, Value Compass, Intimacy Pattern, Ideal Partner
- One final relationship guide
- Odyssey-inspired role stickers and role atlas
- Local answer saving, return-home flow, and share entry point
- Sample report page

## Current Implementation

The current version implements a complete demo loop:

Home -> Assessment -> Demo fill -> Generate report -> Stage reports -> Final relationship guide.

The implementation currently uses frontend rules, report templates, sample signals, and localStorage. Open-ended AI analysis is represented as a product structure and roadmap direction; a future version can connect to a real AI API for semantic analysis and personalized report generation.

## Current Tech Stack

This repository currently uses:

- **Next.js / React** for pages and interactions
- **TypeScript** for type safety
- **CSS** for custom styling
- **lucide-react** for icons
- **localStorage** for local answer, draft, and report state
- **Vitest** for unit tests

The current version does not include a backend, database, payment flow, or real AI API integration.

## Running Locally

```bash
npm install
npm run dev -- --port 3001
```

Open:

```text
http://127.0.0.1:3001
```

## Tests and Build

```bash
npm run test
npm run build
```

## Project Structure

```text
app/
  page.tsx                    Home page
  assessment/                 Assessment page
  report/                     Report page
  report-samples/             Sample report page
lib/
  assessment/                 Question bank, types, scoring logic
  report/                     Sample answers, report templates, report generation
tests/                        Unit tests
public/role-stickers/         Odyssey role sticker assets
```

## Demo Flow

1. Open the home page.
2. Click "免费开始测评".
3. On the assessment page, click "演示填完".
4. Click "生成报告".
5. Review the four stage reports and the final relationship guide.

## MVP Trade-offs

- **Validate the core loop first**: The current version focuses on the path from answering questions to receiving a report and suggestions, rather than expanding into accounts, community, or historical profiles too early.
- **Keep it as lightweight self-discovery**: The product is positioned as a relationship self-portrait and reflection tool, not as a clinical psychology assessment or professional counseling product.
- **Keep report generation stable**: Structured questions and rule-based scoring provide stable outputs, while open-ended answers and AI are reserved for deeper personalization.
- **Leave room for monetization later**: Paid unlocks, user accounts, history, share links, and real AI analysis are treated as later-stage extensions.

## Roadmap

- Add Supabase for user answers, report results, and history
- Connect DeepSeek V4 Pro for open-ended semantic analysis and personalized report generation
- Add login, report history, and shareable report links
- Add Stripe for paid full-report or deep-reading unlocks
- Generate PDF relationship guides
- Improve mobile experience for in-app browsers such as WeChat

## Notes

This public repository keeps the runnable demo, core source code, and tests. Detailed question mappings, report rules, and future commercialization plans are treated as product design work-in-progress and are not included in the public repository.
