-------------
name: frontend-design
description: Apply a design-system-first workflow for UI design, prioritizing project tokens, accessibility, and structured fallback rules before using defaults.
--------------
# Design System First UI Skill

## Goal

Apply a design-system-first workflow before introducing any fallback UI defaults. Always prefer the project's existing design system, palette, typography, spacing, and component patterns over generic choices.

## Core Principle

Prioritize the project's design system before using defaults.

## When To Use

Use this skill when:

1. Designing a new screen, flow, or component.
2. Updating an existing interface.
3. Creating design tokens or implementation guidance.
4. Translating product requirements into UI rules.

## Pre-Design Checklist

Before proposing styles or components, check:

1. Does the project have a design system?
2. Does the project define a color palette?
3. Does the project define typography?
4. Is there a spacing scale?

## Project Detection Priority

Resolve visual decisions in this order:

1. Project-defined design system.
2. Project-defined color palette.
3. Project-defined typography.
4. Fallback design system defaults.

## Required AI Behavior

If the palette is missing, ask the user.

If typography is missing, ask the user.

If the user does not provide missing information, use default design system tokens.

Never override a project palette or typography system with personal or generic preferences.

## Color Rules

### Global Rules

- Never override the project palette.
- Use semantic colors only for status and state communication.
- Maintain at least 4.5:1 contrast for normal text.
- Target WCAG AA contrast compliance.

### Color Categories

#### Core Colors

Purpose: brand identity and primary actions.

- Primary: main user actions.
- Secondary: secondary actions.
- Neutral: structural UI elements.

#### Semantic Colors

Purpose: status communication.

- Success: operation completed.
- Error: system error or failure.
- Warning: attention required.
- Info: informational feedback.

#### Background Colors

Purpose: visual hierarchy through layers.

Rule: each interface level should have a distinct background when layering is important to comprehension.

#### Text Colors

Purpose: readable content hierarchy.

- Primary
- Secondary
- Tertiary
- Disabled

## Typography Rules

### Priority

Choose typography in this order:

1. Project typography.
2. Design system typography.
3. System font fallback.

### Fallback Stack

Use this stack only if no project typography exists:

```css
system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
```

### Rules

- Use no more than 3 font weights.
- Maintain a clear typographic hierarchy.
- Body line height should stay between 1.5 and 1.6.
- Heading line height should stay between 1.1 and 1.3.

### Type Scale

| Token | Size | Line Height | Purpose |
| --- | ---: | ---: | --- |
| `title-xxxl` | 80px | 88px | Hero headings |
| `title-xxl` | 64px | 72px | Page titles |
| `title-xl` | 48px | 56px | Section headings |
| `title-l` | 40px | 48px | Large section headings |
| `title-m` | 32px | 40px | Subsections |
| `title-s` | 24px | 32px | Component headings |
| `headline` | 20px | 28px | Short descriptive text |
| `body` | 16px | 24px | Main readable content |
| `caption` | 14px | 20px | Metadata and labels |
| `caption-small` | 12px | 20px | Secondary metadata |

## Spacing Rules

### Spacing Scale

Use this spacing system unless the project defines its own:

```text
4, 8, 12, 16, 24, 32, 48, 64
```

### Guidance

- Internal padding: small.
- Component spacing: medium.
- Section spacing: large.

### Reference Values

- Card padding: 16px.
- Component gap: 24px.
- Section gap: 64px.

Spacing should create hierarchy more reliably than color alone.

## Border Radius Rules

### Radius Scale

```text
0, 4, 8, 16, 24, 48
```

### Guidelines

- Utilitarian UI: small radius.
- Modern UI: medium radius.
- Playful UI: large radius.

### Reference Values

- Buttons: 8px.
- Cards: 16px.
- Avatars: 50%.

## Elevation Rules

Use elevation to communicate hierarchy, not decoration.

- Base layer: no shadow.
- Card: small shadow.
- Modal: medium shadow.
- Floating elements: large shadow.

## Component Rules

### Buttons

- Allow only one primary action per screen.
- Supported variants: primary, secondary, tertiary.
- Supported states: default, hover, active, disabled.

### Inputs

- Every input must have a label.
- Do not rely on placeholder-only labels.
- Reason: accessibility and clarity.

### Lists

Use lists for:

- Repeated data.
- Records.
- Search results.

### Cards

Use cards for:

- Grouping related content.
- Product items.
- Dashboard modules.

## Interaction States

Design for these states when relevant:

- Default
- Hover
- Active
- Disabled
- Error
- Success

## Motion Rules

- Animation must clarify a state change.
- Avoid purely decorative animation.
- Prefer durations of 150ms to 250ms.
- Common patterns: hover feedback, dropdown expansion, accordion transitions, tab switching.

## Accessibility Rules

Always verify:

- Contrast ratio.
- Focus states.
- Input labels.
- Touch target size.

Minimum touch target size: 44px.

## Fallback Behavior

If required design tokens are missing:

1. Ask the user first.
2. If there is no response, use default design tokens.

## Output Requirements

When using this skill, produce recommendations in this order:

1. Existing project design system constraints.
2. Missing information that must be confirmed.
3. Proposed color, typography, spacing, radius, and elevation rules.
4. Component behavior and interaction states.
5. Accessibility checks.
6. Fallback tokens only if project tokens are unavailable.

## Default Fallback Tokens

Use these only if the project has no explicit tokens and the user does not provide them:

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;

  --radius-0: 0;
  --radius-1: 4px;
  --radius-2: 8px;
  --radius-3: 16px;
  --radius-4: 24px;
  --radius-5: 48px;

  --font-family-base: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-size-title-xxxl: 80px;
  --line-height-title-xxxl: 88px;
  --font-size-title-xxl: 64px;
  --line-height-title-xxl: 72px;
  --font-size-title-xl: 48px;
  --line-height-title-xl: 56px;
  --font-size-title-l: 40px;
  --line-height-title-l: 48px;
  --font-size-title-m: 32px;
  --line-height-title-m: 40px;
  --font-size-title-s: 24px;
  --line-height-title-s: 32px;
  --font-size-headline: 20px;
  --line-height-headline: 28px;
  --font-size-body: 16px;
  --line-height-body: 24px;
  --font-size-caption: 14px;
  --line-height-caption: 20px;
  --font-size-caption-small: 12px;
  --line-height-caption-small: 20px;
}
```
