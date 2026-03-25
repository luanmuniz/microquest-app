# Microquest Project Overview

## 1. Introduction

Microquest is a local-first web application designed to help users turn broad intentions into practical daily action. The product reduces decision fatigue by encouraging the user to maintain a personal list of small quests, select exactly one quest as the focus for the current day, complete that quest, and optionally record a short reflection. The overall design goal is to make progress feel manageable, visible, and repeatable without requiring an account, cloud setup, or complex onboarding.

The application currently runs as a responsive single-page interface with logical routes for Welcome, Quests, Today, History, and a fallback not-found page. Routing is implemented with a hash router, so end users see browser URLs such as `#/welcome` and `#/quests`.

## 2. Product Purpose

Microquest exists to support three practical user needs:

- Help users define small, actionable personal goals instead of vague ambitions.
- Help users focus on one clear action at a time by designating a single quest for today.
- Help users maintain momentum by recording completions and reviewing prior wins in history.

This purpose is reinforced by a low-friction product model:

- No sign-in or account creation is required.
- Data stays on the device by default.
- The product is usable on both desktop and mobile.
- The interface relies on clear state transitions instead of complex dashboards or settings.

## 3. Core Product Loop

Microquest is organized around a simple repeatable loop:

1. Build a quest list.
2. Choose one quest as today's focus.
3. Complete the quest and optionally write a reflection.
4. Review the result in history.
5. Repeat the process with the next quest.

This loop is reinforced throughout the product in the welcome explanation, guided tutorial, page structure, and navigation patterns.

## 4. Implemented Features And Their Goals

| Feature | Current Behavior | Purpose Or Goal |
| --- | --- | --- |
| Welcome and onboarding page | New users are redirected to the Welcome screen before entering the main app. The page explains what Microquest does and how the core loop works. | Reduce first-use confusion and make the product promise clear before the user starts interacting with data. |
| Starter quest suggestions | On first launch, the app creates three sample quests. | Give new users immediate example content so the product does not feel empty or abstract. |
| Start using flow | The primary welcome action sends the user into the app. On desktop it starts the guided tutorial. On mobile it skips the tutorial and opens Quests directly. | Reduce friction while matching the strengths and limits of each device type. |
| "I already know the app" flow | The welcome page offers a confirmation dialog with two choices: keep current data or clear current data and start fresh. | Support returning users or evaluators who want to bypass the default sample-data experience. |
| Quest creation | Users can create a new quest with a required title and optional description. | Let users define small, personalized actions that matter to them. |
| Quest editing | Existing quests can be edited in a modal form. Editing converts a starter quest into a user-owned quest entry. | Support refinement as users clarify or personalize their goals. |
| Quest deletion | Users can delete a quest after confirming the action. | Keep the quest list relevant and remove unwanted or obsolete items. |
| Set today's quest | Any quest that is not already selected can be marked as today's quest. Only one quest can be selected at a time. | Focus attention on one concrete action instead of many simultaneous goals. |
| Today's Quest page | The app either shows the selected quest with a completion flow or an empty state that sends the user back to Quests. | Maintain a dedicated focus area for daily action. |
| Completion with reflection | Completing today's quest creates a history entry and clears the today selection. Reflection text is normally optional. | Reinforce completion, encourage reflection, and preserve the result as visible progress. |
| Completion history | Completed quests are listed in reverse chronological order. Each entry can be expanded to view its reflection, or a placeholder message if no reflection was recorded. | Help users review effort over time and make progress feel cumulative. |
| Desktop guided tutorial | Desktop users can be guided through creating a quest, setting it as today's quest, completing it with a required reflection, and reviewing it in history. The tutorial can be skipped, preserved, or cleaned. | Provide structured first-use training and demonstrate the full product loop through live interaction. |
| Responsive navigation | Desktop uses a top navigation bar with a secondary backup menu. Mobile uses bottom navigation for core routes and a separate More sheet for secondary actions. | Preserve full feature access while adapting interaction patterns to screen size. |
| How It Works access | Users can return to the Welcome page from navigation to review the product explanation after first use. | Keep onboarding guidance available beyond the first session. |
| Shortcut and recovery actions | The Welcome header includes an `Enter App` shortcut, Today includes a link to change today's quest, empty states provide next-step actions, and the 404 page offers a recovery route back to Quests. | Reduce dead ends and help users recover quickly from uncertainty or invalid states. |
| JSON export | Users can download a JSON backup containing quests, today's selected quest, and completion history. | Provide local backup control without requiring server storage. |
| JSON import | Users can upload a JSON backup exported from Microquest. Import replaces the current local dataset after validation. | Support local restoration or transfer of data between browser contexts. |
| Clean data reset | Users can wipe quests, today selection, completion history, and onboarding state from the navigation menu. | Provide a full reset path for testing, demos, or restarting from a clean state. |
| Toasts and confirmations | Success toasts and confirmation dialogs are used throughout destructive or state-changing flows. | Reduce ambiguity, provide feedback, and lower the risk of accidental destructive actions. |
| 404 fallback page | Invalid routes display a not-found screen with a route recovery action back to Quests. | Preserve navigational recovery if the user enters an invalid path. |

## 5. Current Route Map

The current implemented routes are:

- `#/` - Redirects to `#/welcome` or `#/quests` depending on whether welcome onboarding has already been completed.
- `#/welcome` - Introductory page describing the product and the first-use actions.
- `#/quests` - Main quest management page.
- `#/today` - Focus page for the currently selected daily quest.
- `#/history` - History page for completed quests.
- Any unmatched route, such as `#/does-not-exist` - Not-found page with recovery back to Quests.

## 6. Main User Paths

### 6.1 First-Time Desktop User

1. User opens the app with no onboarding state stored.
2. Root route redirects to Welcome.
3. Welcome page explains the product and offers entry actions.
4. User selects "Start Using Microquest."
5. Welcome state is marked as complete, tutorial state is reset, and the user is sent to Quests.
6. The guided tutorial starts and walks the user through:
   - opening quest creation,
   - creating a quest,
   - setting that quest as today's quest,
   - opening the Today page,
   - adding a reflection,
   - completing the quest,
   - opening History,
   - confirming the result,
   - deciding whether to keep or clean tutorial data.

### 6.2 First-Time Mobile User

1. User opens the app with no onboarding state stored.
2. Root route redirects to Welcome.
3. User selects "Start Using Microquest."
4. Welcome and tutorial state are both marked as complete.
5. User is sent directly to Quests.
6. No guided tutorial is shown on mobile.
7. The user proceeds through normal quest management and completion flows using the mobile navigation model.

### 6.3 Returning User With Existing Data

1. User opens the app after previously completing welcome onboarding.
2. Root route redirects directly to Quests.
3. Existing quests, selected today quest, and history are restored from local storage.
4. User can continue normal use without revisiting onboarding unless they intentionally open "How it works" or reset app data.

### 6.4 User Starts Fresh From The Welcome Page

1. User opens Welcome and selects "I already know the app."
2. A confirmation dialog offers:
   - Keep current data.
   - Clear current data and start fresh.
3. If the user keeps current data, onboarding is marked complete and the app opens Quests with the existing dataset.
4. If the user clears data, the quest list, current today selection, and history are emptied, onboarding is marked complete, and the app opens Quests with an empty state.

### 6.5 Daily Productivity Path

1. User opens Quests.
2. User creates or selects a quest.
3. User marks a quest as today's quest.
4. User opens Today.
5. User completes the quest, optionally leaving a reflection.
6. The app records completion history and clears the today selection.
7. User opens History to confirm the completed result.

### 6.6 In-App Recovery And Navigation Support

Microquest includes several smaller actions that support smooth path recovery:

- The Welcome header `Enter App` button provides a fast route from the explanatory page back into the main app.
- The Today page includes a direct link back to Quests if the user wants to change today's selection.
- Empty states provide next-step actions so the user is not trapped on a blank screen.
- The not-found page provides a recovery action back to Quests after an invalid route.

### 6.7 Local Backup And Restore Path

1. User opens backup controls from desktop navigation or the mobile More menu.
2. User exports data to download a JSON file.
3. Later, or in another browser context, the user opens Import data.
4. The app validates the selected JSON file.
5. If validation succeeds, importing replaces the current local dataset.
6. If validation fails, the current dataset remains unchanged and an error message is shown.

### 6.8 Full Reset Path

1. User opens the clean-data action from navigation.
2. User confirms the destructive action.
3. The app clears quests, today selection, history, and onboarding state.
4. The user is redirected to the root route.
5. Root routing sends the user back to Welcome because onboarding is no longer marked complete.

## 7. Key State Transitions

The following transitions define the most important system behavior in the current release:

- First visit:
  The user lands on Welcome because welcome onboarding has not yet been marked as seen.

- First data state:
  If the main local data key does not exist, the app creates starter quests and begins with no selected today quest and no completion history.

- Invalid stored data:
  If the stored quest JSON is invalid or unreadable, the app safely falls back to the starter quest state instead of crashing.

- Welcome completion on desktop:
  Starting the app from Welcome resets tutorial completion and allows the guided tutorial to run.

- Welcome completion on mobile:
  Starting the app from Welcome marks the tutorial as seen immediately, so guided tutorial steps do not run.

- Empty versus populated Quests:
  Quests can display either starter/user quests or a fully empty state depending on how the app was entered or reset.

- Empty versus selected Today state:
  Today shows an empty state until a quest is explicitly selected as today's quest.

- Completion event:
  Completing today's quest creates a new completion entry at the top of history and clears the current today selection.

- Deleting the selected today quest:
  If the user deletes the quest currently marked for today, the app removes the quest and clears the today selection.

- Empty versus populated History:
  History remains empty until at least one quest has been completed.

- Import event:
  Importing a valid JSON backup replaces the existing in-browser data instead of merging with it.

- Navigation clean-data reset:
  Cleaning data from navigation clears both app data and onboarding flags, which returns the user to the Welcome path on the next redirect.

## 8. Responsive Behavior

Microquest is intentionally responsive and changes behavior at the `1024px` breakpoint.

### 8.1 Desktop Behavior

- Main navigation appears in the top header.
- Quests, Today, History, and How it works are visible directly in the header.
- Backup actions are grouped inside a secondary menu.
- The guided tutorial is available and can run when onboarding conditions are met.
- Dialogs and overlays are presented in a traditional desktop layout.

### 8.2 Mobile Behavior

- Main navigation appears as a persistent bottom navigation bar.
- Secondary actions such as How it works, Import data, Export data, and Clean data are moved into a More sheet.
- The guided tutorial is disabled and immediately marked as seen.
- Layout, spacing, and modal behavior adapt to smaller screens.

## 9. Data Model And Storage

Microquest currently stores all persistent state in the browser's local storage.

### 9.1 Local Storage Keys

- `microquest-data`
  Stores quests, today's selected quest identifier, and completion history.

- `microquest-welcome-seen`
  Stores whether the Welcome experience has already been completed.

- `microquest-tutorial-seen`
  Stores whether the guided tutorial has already been completed or skipped.

### 9.2 Stored Data Structure

The main exported and imported data snapshot contains:

- `quests`
  An array of quest objects with identifier, title, description, creation date, and optional starter flag.

- `todayQuestId`
  The identifier of the currently selected quest for today, or `null` if no quest is selected.

- `completions`
  An array of completion objects containing completion identifier, linked quest identifier, quest title, timestamp, and reflection text.

### 9.3 Import And Export Rules

- Export downloads a JSON snapshot of the current dataset.
- Import accepts JSON only.
- Import validates the full shape of the backup before applying it.
- Import fails if required fields are missing, if the JSON is malformed, or if `todayQuestId` references a quest that is not present in the file.
- Import replaces the whole dataset rather than merging individual records.

## 10. Current Limitations

The following limitations are part of the current implemented release and should be documented clearly for stakeholders and testers:

- Data is local to one browser context unless the user exports and imports it manually.
- The app does not include sign-in, cloud sync, collaboration, or server storage.
- Only one quest can be selected as today's quest at a time.
- Reflection is optional during normal usage, but it becomes required during the desktop guided tutorial for the tutorial-created quest.
- Completion history entries can be viewed but not edited or deleted.
- The mobile experience has no guided tutorial overlay.
- The app does not currently provide search, filtering, sorting, streaks, reminders, or analytics dashboards.
- Export and import are manual backup tools, not automatic synchronization.

## 11. Release-Relevant Observations

For release preparation, the most important behaviors to preserve are:

- Clear first-use onboarding on both desktop and mobile.
- Reliable quest CRUD behavior.
- Accurate selection and clearing of today's quest.
- Stable completion history recording.
- Safe destructive actions with confirmation.
- Correct import/export validation.
- Persistence across page reloads.
- Predictable recovery from invalid stored data.

These behaviors define the current user promise of Microquest and should be treated as the basis for QA and pre-release user testing.

## Next Steps

After the first release, the next steps for the project include:

- Create a user testing plan to gather feedback on the onboarding experience, core loop, and overall usability.
- Collecting user feedback and usage data to identify pain points and opportunities.
- Iterating on the onboarding experience to further reduce friction and clarify the product promise.
- Refining the UI and interaction patterns based on real-world usage and feedback.
- Ensuring accessibility and performance optimizations across devices.