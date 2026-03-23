# MicroQuest Redesign Master Prompt

Copy and paste the prompt below into your design-generating AI tool.

```md
You are a senior product designer and UX strategist. Redesign the website/app experience for **MicroQuest**.

## Project Intent
MicroQuest is a **local-first personal habit and progress app** that helps users turn intentions into action through one focused daily quest.
The product should feel supportive, motivating, and clear, with low friction and strong momentum.

## Core Product Purpose (Must Keep)
- Help users create and manage small personal quests.
- Help users choose exactly one quest as today’s focus.
- Help users complete that quest with optional reflection.
- Help users see progress over time in history.

Do **not** change this product purpose.

## Functional Scope To Preserve (Must Keep All)
- Quest CRUD:
  - Create quest
  - Edit quest
  - Delete quest (with confirmation)
- Today focus:
  - Mark one quest as "today's quest"
  - Complete today’s quest
  - Reflection input at completion
- History:
  - Completed quest entries
  - Expandable entry to read reflection
- Onboarding:
  - Welcome page / explanation of how it works
  - Guided first-use tutorial flow that walks users through creating, selecting, completing, and reviewing
- Data controls:
  - Export user data as JSON
  - Clean/reset all app data (with confirmation)
- System states:
  - Empty states for Quests, Today, and History
  - Confirmation dialogs for destructive actions
- Navigation:
  - Main sections: Welcome, Quests, Today, History
  - Desktop and mobile navigation patterns

## Product & Platform Constraints
- No account or authentication required.
- Data is stored locally on device.
- Responsive behavior must be first-class for both desktop and mobile.
- Mobile must include:
  - Persistent bottom navigation for main sections
  - A separate mobile menu/action area for secondary actions (e.g., data actions/help)
- Keep functional parity across breakpoints.

## Current UX Baseline (Context, Not Style Lock)
- Tone is supportive and motivational.
- Current visual direction is warm/cozy.
- You are free to change visual direction completely.
- You may improve or rewrite microcopy/headlines/buttons, but keep original meaning and feature intent.

## Redesign Objective
Create a **high-quality, modern redesign** with strong visual identity and clearer interaction hierarchy, while preserving the exact product purpose and feature scope.

You have broad creative freedom over:
- Layout systems
- Typography
- Color palette
- Component styling
- Interaction design
- Visual language and branding direction

## Required Deliverables
Produce all items below in one response:

1. **Design Concept Summary**
- One concise concept statement
- Design principles (3-6)
- Intended emotional tone and user perception

2. **Design System Direction**
- Typography system (families, scale, usage)
- Color system (roles and rationale)
- Spacing/radius/shadow guidelines
- Component style principles
- Iconography and illustration/art direction guidance

3. **Screen-by-Screen Redesign Specs**
Describe structure, hierarchy, and key interactions for:
- Welcome / onboarding landing
- Quests page (list + empty state)
- Create/Edit quest modal/dialog
- Delete confirmation dialog
- Today page (with and without selected quest)
- Completion interaction (reflection + completion action)
- History page (list + empty state + expanded entry)
- Desktop top navigation + data/help access
- Mobile bottom navigation + secondary action menu
- Data export and clean/reset flows
- Tutorial overlay/coachmark experience

4. **State & Interaction Coverage**
Include explicit behavior for:
- Empty states
- Success feedback (e.g., completion/export)
- Error/failure messaging patterns
- Confirmation and destructive actions
- Motion/animation guidelines (subtle, meaningful)

5. **Responsive Behavior Notes**
- Define how layout and navigation adapt from mobile to desktop.
- Clarify touch target, density, and readability considerations for small screens.

6. **Accessibility & Usability**
- Color contrast guidance
- Keyboard/focus behavior
- Clear hierarchy and readability
- Form clarity and validation UX
- Inclusive language and cognitive load considerations

## Quality Bar
- Do not remove any existing core feature.
- Do not introduce account/auth requirements.
- Prioritize clarity, momentum, and habit consistency.
- Keep the redesign practical enough for implementation by a React/Tailwind team.

Return your answer as a structured redesign spec that can directly guide UI implementation.
```
