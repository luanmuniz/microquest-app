# Microquest Pre-Release User Testing Sheet

## 1. Study Purpose

This document supports moderated user testing before production release. The goal is to evaluate whether real users can understand Microquest, move through the core daily workflow, trust the local-only data model, and use the product comfortably on both desktop and mobile.

The study is based only on the current implemented release. It does not test roadmap ideas or future features.

This sheet also defines how to record session results for submission-ready reporting using:

- `docs/qa-reporting/microquest-test-results-template.xlsx`
- `docs/qa-reporting/microquest-test-report-template.md`

## 2. Research Goals

The study should answer the following questions:

- Can a first-time user understand what Microquest is for after seeing the Welcome page?
- Can a user create a quest, select it for today, complete it, and confirm the result in history without heavy assistance?
- Can users understand the difference between core navigation actions and secondary data-management actions?
- Do users understand that data stays on the device unless they export it?
- Do desktop users find the guided tutorial helpful and understandable?
- Do mobile users remain successful without the guided tutorial?
- Are import, export, and reset controls understandable enough to feel safe before release?

## 3. Recommended Participant Profile

Recruit participants who broadly match expected end users of a lightweight personal productivity or habit-building tool.

### 3.1 Suggested Mix

- 6 to 8 participants total
- At least 3 desktop sessions
- At least 3 mobile sessions
- A mix of users who regularly use habit, to-do, or journaling tools and users who do not

### 3.2 Useful Screening Characteristics

- Comfortable using everyday mobile and desktop web apps
- No prior knowledge of the Microquest interface
- Interested in personal productivity, self-improvement, or daily habit tools

## 4. Session Format

### 4.1 Recommended Duration

- 30 to 45 minutes per participant

### 4.2 Moderator Materials

- A clean browser session for each participant
- Access to both desktop and mobile test environments
- Screen recording or note-taking setup
- A prepared valid JSON backup file for discussion if needed
- Observation sheet and feedback form from this document
- Results workbook at `docs/qa-reporting/microquest-test-results-template.xlsx`

### 4.3 Test Environment Preparation

Before each session:

1. Clear:
   - `microquest-data`
   - `microquest-welcome-seen`
   - `microquest-tutorial-seen`
2. Confirm the app opens on `#/welcome`.
3. Confirm the device matches the intended session type:
   - Desktop session above `1024px`
   - Mobile session below `1024px`
4. Capture baseline metadata before starting tasks:
   - Session ID
   - Environment ID (`ENV-01`, `ENV-02`, `ENV-03`, or `ENV-04`)
   - Device model
   - OS and version
   - Browser and version
   - Exact resolution or viewport (`W x H`)

### 4.4 Session Logging Rules

For each participant session:

1. Add one row per task in `User_Session_Tasks`.
2. Use outcome values exactly as written:
   - `Completed independently`
   - `Completed with help`
   - `Not completed`
3. When a notable issue appears, create or reuse a finding ID in `Findings_List`.
4. If screenshots are captured, reference them by screenshot ID in task notes or findings evidence.

## 5. Moderator Script

Use the following script with minor natural adjustments as needed.

### 5.1 Opening Script

Read or paraphrase:

> Thank you for taking part. We are testing the product, not you. Please think aloud as you use the app and tell us what you expect to happen, what feels clear, and what feels confusing. Some tasks may feel easy and some may not. That is useful feedback for us.

### 5.2 Expectations Script

Read or paraphrase:

> I may ask follow-up questions, but I will try not to guide you unless you become fully blocked. If something feels unclear, please say so in the moment.

### 5.3 Closing Script

Read or paraphrase:

> At the end, I will ask a few short questions about what felt helpful, what felt risky or confusing, and whether this product feels ready for real users.

## 6. Moderator Rules During The Session

- Encourage think-aloud behavior, but do not explain the interface unless the participant is truly blocked.
- If the participant asks a direct "what should I click?" question, reply with a neutral prompt such as: `What would you expect to click here?`
- Record hesitation, misclicks, backtracking, and confidence changes.
- Distinguish between:
  - confusion caused by product wording
  - confusion caused by layout or navigation
  - confusion caused by data-risk concerns

## 7. Breakpoint-Specific Testing Notes

### 7.1 Desktop Sessions

- Let the participant experience the guided tutorial if it appears naturally.
- Observe whether the tutorial is understandable, appropriately paced, and visually clear.
- Pay special attention to whether the participant understands why reflection is required during the tutorial completion step.

### 7.2 Mobile Sessions

- Confirm that the participant can succeed without any tutorial overlay.
- Pay special attention to bottom navigation discoverability and the More sheet for secondary actions.
- Observe whether destructive and backup actions feel hidden, safe, or confusing.

## 8. Task List

Run the tasks in order. If the participant gets blocked for more than about two minutes, note the block and provide minimal assistance so the session can continue.

### Task 1: Understand The Welcome Screen

- Prompt: `Without clicking anything yet, tell me what you think this app is for and what you expect to do with it.`
- Success Criteria: The participant can explain that the app is for managing small daily quests or habit-like actions.
- Watch For:
  - Misunderstanding the product as a game, a long-form journal, or a complex task manager
  - Missing the core idea of choosing one quest for today

### Task 2: Enter The App

- Prompt: `Please enter the app in the way that feels most natural to you.`
- Success Criteria:
  The participant enters the main app without moderator help.
- Session Notes:
  - Desktop: If the tutorial starts, let it continue naturally.
  - Mobile: Confirm the participant notices the absence of tutorial and still understands what to do next.

### Task 3: Create A Personal Quest

- Prompt:
  `Create a quest you might realistically want to complete today.`
- Success Criteria:
  The participant opens the correct form, understands the required title, and creates a new quest successfully.
- Watch For:
  - Trouble finding the create action
  - Confusion about title versus description
  - Uncertainty caused by starter quests

### Task 4: Choose Today's Quest

- Prompt:
  `Select the quest you want to focus on today.`
- Success Criteria:
  The participant successfully marks a quest as today's quest.
- Watch For:
  - Difficulty recognizing which action sets today's quest
  - Uncertainty about whether multiple quests can be selected

### Task 5: Complete Today's Quest With Reflection

- Prompt:
  `Go to today's quest, complete it, and add a short note about how it went.`
- Success Criteria:
  The participant reaches Today, finds the reflection field, and completes the quest.
- Session Notes:
  - Desktop: During tutorial, the participant must enter reflection text before completion.
- Watch For:
  - Not noticing the Today page
  - Not understanding whether reflection is optional
  - Hesitation before a destructive-feeling completion action

### Task 6: Find The Completed Result

- Prompt:
  `Find the quest you just completed and show me where you would review the details later.`
- Success Criteria:
  The participant reaches History and expands the relevant entry if needed.
- Watch For:
  - Trouble locating History
  - Not realizing entries are expandable

### Task 7: Revisit Help Or Product Explanation

- Prompt:
  `Imagine you want to review how this app works. Show me where you would go.`
- Success Criteria:
  The participant finds the `How it works` route or equivalent Welcome-page path.
- Watch For:
  - Assuming the explanation is no longer available after first use
  - Difficulty locating this option on mobile

### Task 8: Export Data

- Prompt:
  `Imagine you want a backup of your data on this device. Show me how you would do that.`
- Success Criteria:
  The participant locates export controls and understands that a JSON file is downloaded.
- Watch For:
  - Confusion between Import and Export
  - Low trust in backup wording
  - Difficulty finding data controls on mobile

### Task 9: Locate Import And Reset Controls

- Prompt:
  `Without actually wiping your work unless I ask you to, show me where you would import an old backup and where you would reset the app. Tell me what you think each one would do.`
- Success Criteria:
  The participant can find Import data and Clean data and can explain the difference between them.
- Watch For:
  - Fear around destructive actions
  - Incorrect mental model that import merges instead of replacing
  - Confusion about whether reset also affects onboarding

## 9. Observation Note Template

Use this sheet during the session. Copy key values into `User_Session_Tasks` during or right after the session.

| Field | Notes |
| --- | --- |
| Session ID |  |
| Participant ID |  |
| Session type | Desktop / Mobile |
| Environment ID | ENV-01 / ENV-02 / ENV-03 / ENV-04 |
| Device model |  |
| OS and version |  |
| Browser and version |  |
| Resolution (W x H) |  |
| Date |  |
| Moderator |  |
| Overall confidence at start |  |
| Overall confidence at end |  |

### Task Observation Grid

| Task | Completed independently | Completed with help | Not completed | Time | Key hesitation or confusion | Notable quote | Finding ID |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Understand Welcome |  |  |  |  |  |  |  |
| 2. Enter app |  |  |  |  |  |  |  |
| 3. Create quest |  |  |  |  |  |  |  |
| 4. Choose today's quest |  |  |  |  |  |  |  |
| 5. Complete with reflection |  |  |  |  |  |  |  |
| 6. Find completed result |  |  |  |  |  |  |  |
| 7. Revisit help |  |  |  |  |  |  |  |
| 8. Export data |  |  |  |  |  |  |  |
| 9. Locate import and reset |  |  |  |  |  |  |  |

### Additional Moderator Notes

- First point of friction:
- Most confusing label or action:
- Most reassuring part of the experience:
- Strongest sign of trust or distrust:
- Navigation issues:
- Data-risk concerns:
- Desktop tutorial observations or mobile discoverability observations:
- Recommendation for release readiness:

## 10. Feedback Form For Participants

Use the following questions at the end of each session. The participant can answer verbally or in writing.

### 10.1 Task Confidence

For each item, ask the participant to rate from 1 to 5:

- 1 = Very difficult or very unclear
- 5 = Very easy or very clear

| Question | Rating 1-5 |
| --- | --- |
| It was easy to understand what Microquest is for. |  |
| It was easy to create a quest. |  |
| It was easy to choose today's quest. |  |
| It was easy to complete today's quest. |  |
| It was easy to find completed work in history. |  |
| It was easy to find navigation options. |  |
| It was easy to understand the backup and reset controls. |  |

### 10.2 Perceived Value

Ask:

`How valuable do each of these features feel to you?`

Rate each from 1 to 5:

| Item | Rating 1-5 |
| --- | --- |
| Welcome explanation |  |
| Quest list |  |
| Today's Quest page |  |
| Reflection field |  |
| History |  |
| Guided tutorial if shown |  |
| Export backup |  |
| Import backup |  |

### 10.3 Trust And Risk Questions

Ask the participant:

1. `Do you trust that your data stays on this device unless you export it? Why or why not?`
2. `Did the import, export, or clean-data actions feel safe and understandable? Why or why not?`
3. `Was there any point where you were worried about losing data or making a mistake?`

### 10.4 Open Feedback Questions

Ask the participant:

1. `What part of the app felt easiest to understand?`
2. `What part felt most confusing or least polished?`
3. `Was anything missing that you expected to find?`
4. `If this were released today, would you feel comfortable using it for your own daily goals? Why or why not?`
5. `What is the one improvement you would make before release?`

## 11. Facilitator Debrief Template

Complete this immediately after each session while details are still fresh.

| Debrief Field | Notes |
| --- | --- |
| Session ID |  |
| Participant ID |  |
| Top 3 issues observed |  |
| Severity of each issue |  |
| Was the core loop completed? |  |
| Desktop tutorial result or mobile navigation result |  |
| Backup and reset understanding |  |
| Release recommendation for this participant | Ready / Needs fixes / High risk |

## 12. Study Readout Expectations

At the end of the pre-release study, summarize findings in the following categories inside `docs/qa-reporting/microquest-test-report-template.md`:

- Onboarding clarity
- Quest creation and management usability
- Today and completion flow clarity
- History discoverability and comprehension
- Navigation clarity by device type
- Trust in local-only storage and backup controls
- Release blockers and recommended fixes

The release should be considered at risk if multiple participants fail to complete the core loop or show consistent distrust in backup and destructive actions.

## 13. From Findings To Implementation Flow

After each testing wave:

1. Consolidate issues into `Findings_List` with one finding ID per unique issue.
2. Write a short proposed fix for each finding.
3. Implement fixes in the app and update `Implementation Status`.
4. Re-test affected QA cases and user tasks.
5. Record `Retest Result` and summary notes.
6. Reflect implemented changes and remaining risks in the final report template.
