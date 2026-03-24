# Microquest Manual QA Test Plan

## 1. Purpose

This document defines the manual quality-assurance plan for the current implemented release of Microquest. It is intended to verify that all visible features, routes, dialogs, state transitions, and error-handling flows work correctly before production release.

The test plan is limited to features that are already implemented in the current codebase. Roadmap items and future enhancements are intentionally excluded.

## 2. Scope

### 2.1 In Scope

- Welcome and onboarding behavior
- Desktop guided tutorial behavior
- Quest creation, editing, deletion, and starter-quest behavior
- Selection and clearing of today's quest
- Completion flow and reflection behavior
- Completion history behavior
- Desktop and mobile navigation behavior
- Help and return-to-Welcome behavior
- Data export, import, and clean-data reset flows
- Local persistence and recovery from invalid stored data
- Not-found route handling

### 2.2 Out Of Scope

- Roadmap features not present in the current app
- Performance benchmarking
- Automated testing infrastructure
- Backend, API, or authentication testing because the app is local-first and currently has no backend or account system

## 3. Test Environments

The following environments are release-critical because behavior changes across browsers and across the `1024px` breakpoint.

| Environment ID | Device Class | Browser | Minimum Focus |
| --- | --- | --- | --- |
| ENV-01 | Desktop | Latest Chrome | Primary desktop validation and tutorial coverage |
| ENV-02 | Desktop | Latest Safari | Desktop compatibility and tutorial coverage |
| ENV-03 | Mobile | iPhone Safari | Mobile navigation, onboarding without tutorial, dialogs, and data controls |
| ENV-04 | Mobile | Android Chrome | Mobile navigation, onboarding without tutorial, dialogs, and data controls |

### 3.1 Breakpoint Requirement

- Test at widths above `1024px` to verify desktop behavior.
- Test below `1024px` to verify mobile behavior.
- Treat the breakpoint as critical because navigation and tutorial behavior change at this threshold.

## 4. Test Data And Reset Rules

### 4.1 Standard Reset Before A New Test Pass

1. Open browser storage tools.
2. Remove the following local-storage keys if they exist:
   - `microquest-data`
   - `microquest-welcome-seen`
   - `microquest-tutorial-seen`
3. Reload the application.
4. Confirm the app opens to `#/welcome`.

### 4.2 Optional Reusable Test Data

Use the following sample quest content when a test case needs custom records:

- Quest title: `Read 10 pages`
- Quest description: `Read before bed without distractions.`
- Second quest title: `Stretch for 5 minutes`
- Second quest description: `Do a short full-body stretch after work.`
- Reflection text: `I completed it and felt more focused afterwards.`

### 4.3 Backup File Preparation

For import and export tests, keep the following files ready:

- A valid JSON backup exported from the app
- An invalid JSON file, for example a plain-text file renamed with `.json`
- A structurally invalid JSON file missing required fields
- A JSON file where `todayQuestId` points to a quest ID that does not exist in `quests`

## 5. Failure Response Guidance

Follow this protocol whenever any test fails.

### 5.1 Evidence To Capture Before Retesting

Capture all of the following before refreshing, clearing data, or re-running the test:

1. Browser and version
2. Device type
3. Viewport size or breakpoint category
4. Current route, including the hash path
5. Exact preconditions used
6. Exact reproduction steps
7. Screenshot or screen recording of the failed state
8. Visible dialog text, empty-state text, and toast text if relevant
9. Console errors or warnings if relevant
10. For import or export failures, the file name, file source, and a brief description of file contents

### 5.2 Immediate Containment Rules

- Do not clear local storage until the failing state has been recorded.
- Do not overwrite a backup file that may be needed for debugging.
- Do not continue into later cases if the failure blocks a core state transition.
- If data corruption is suspected, export the current state if possible before cleaning anything.

### 5.3 Severity Guidance

- Blocker:
  Core app usage cannot continue, or data is lost unexpectedly.
- Critical:
  A primary user path is broken, misleading, or unsafe.
- Major:
  The feature works partially but with clear functional or usability defects.
- Minor:
  Non-blocking mismatch in copy, layout, polish, or recoverable feedback behavior.

## 6. Detailed Test Cases

### QA-01 First Launch Routing On Desktop

- Objective:
  Verify that a first-time desktop user is redirected to Welcome and sees the expected onboarding content.
- Preconditions:
  All Microquest local-storage keys are removed. Browser width is above `1024px`.
- Steps:
  1. Open the root application URL.
  2. Observe the first rendered route.
  3. Review the hero text and action buttons on the Welcome page.
- Expected Result:
  The app redirects from `#/` to `#/welcome`. The page explains the product, shows the main entry action, and shows the secondary "I already know the app" action.
- Possible Fail Scenarios:
  - App opens directly to Quests without prior onboarding.
  - Blank screen or incorrect route.
  - Welcome copy or actions are missing.
- If Test Fails:
  Follow the failure response guidance, preserve the exact route shown after load, and capture whether local storage was unexpectedly recreated before onboarding completed.

### QA-02 Welcome Start Using Flow On Desktop

- Objective:
  Verify that the primary Welcome action sends a desktop user into the app and activates the guided tutorial.
- Preconditions:
  Same as QA-01.
- Steps:
  1. From Welcome, click `Start Using Microquest`.
  2. Confirm the app navigates to Quests.
  3. Observe whether the guided tutorial overlay appears.
- Expected Result:
  The app opens `#/quests`, the tutorial overlay is visible, and the first tutorial step highlights the quest-creation action.
- Possible Fail Scenarios:
  - Navigation to the wrong route.
  - Tutorial does not appear on desktop.
  - Tutorial appears but does not highlight a valid target.
- If Test Fails:
  Capture the post-click route, screenshot the screen state, and record whether `microquest-welcome-seen` and `microquest-tutorial-seen` were written correctly before any retry.

### QA-03 Welcome Secondary Flow Keep Current Data

- Objective:
  Verify that the Welcome dialog can preserve current data while completing onboarding.
- Preconditions:
  A non-empty dataset already exists in local storage and Welcome is accessible.
- Steps:
  1. Open `#/welcome`.
  2. Click `I already know the app`.
  3. In the dialog, choose `Keep current data`.
  4. Observe the destination page.
- Expected Result:
  The dialog closes, onboarding is marked complete, the app opens Quests, and the existing quests remain unchanged.
- Possible Fail Scenarios:
  - Existing quests disappear.
  - User remains stuck on Welcome.
  - Dialog action text does not match behavior.
- If Test Fails:
  Export the current dataset if possible before further cleanup, capture the quest count before and after the action, and record whether only onboarding keys changed or the main data key changed as well.

### QA-04 Welcome Secondary Flow Clear And Start Fresh

- Objective:
  Verify that the Welcome dialog can clear current quest data and open an empty quest list.
- Preconditions:
  A non-empty dataset already exists in local storage and Welcome is accessible.
- Steps:
  1. Open `#/welcome`.
  2. Click `I already know the app`.
  3. Choose `Clear and start fresh`.
  4. Observe the destination page and the quest list.
- Expected Result:
  The app opens Quests with no quests, no selected today quest, and no history. Onboarding is treated as complete, so the user remains in the main app rather than returning to Welcome.
- Possible Fail Scenarios:
  - Data is not cleared.
  - Starter quests incorrectly reappear immediately.
  - App navigates to Welcome instead of Quests.
- If Test Fails:
  Capture the resulting quest count and route, and verify whether the failure affects only quest data or also onboarding flags.

### QA-05 First Launch Routing On Mobile

- Objective:
  Verify that a first-time mobile user reaches Welcome first and then enters the app without a guided tutorial.
- Preconditions:
  All Microquest local-storage keys are removed. Browser width is below `1024px`.
- Steps:
  1. Open the root application URL.
  2. Confirm the app loads Welcome.
  3. Tap `Start Using Microquest`.
  4. Observe the destination screen and whether any tutorial overlay appears.
- Expected Result:
  The app opens Quests and no guided tutorial is shown. Mobile navigation is visible at the bottom, and secondary actions are available through the More menu.
- Possible Fail Scenarios:
  - Tutorial appears on mobile.
  - Navigation does not adapt to mobile layout.
  - App remains on Welcome after entry.
- If Test Fails:
  Capture the viewport width, screenshot both the initial Welcome state and the post-entry state, and record whether the tutorial-seen flag was set unexpectedly or not set at all.

### QA-06 Full Desktop Tutorial Progression

- Objective:
  Verify the complete desktop tutorial path from quest creation through history review and cleanup choice.
- Preconditions:
  Fresh desktop state after QA-02, tutorial active, width above `1024px`.
- Steps:
  1. In the highlighted flow, open quest creation.
  2. Create a quest titled `Read 10 pages`.
  3. Set the created quest as today's quest when prompted.
  4. Use the highlighted Today navigation item.
  5. Enter a non-empty reflection.
  6. Complete the quest.
  7. Use the highlighted History navigation item.
  8. Confirm the created completion is highlighted.
  9. Click `Continue`.
  10. At the cleanup prompt, test either `Keep tutorial data` or `Clean data and start`.
- Expected Result:
  Each tutorial step advances only when the required action is completed. The created quest becomes the tutorial target, completion appears in History, and the final prompt offers valid keep or clean outcomes.
- Possible Fail Scenarios:
  - Tutorial step does not advance.
  - Highlight points to the wrong element.
  - Completion is not recorded after finishing the tutorial quest.
  - Final cleanup choice does not match actual data state.
- If Test Fails:
  Record the exact tutorial step title, route, highlighted element, and data state. Do not clear local storage until the broken step and current quest IDs have been documented.

### QA-07 Desktop Tutorial Skip Paths

- Objective:
  Verify that the desktop tutorial can be skipped safely with either data retention or data cleanup.
- Preconditions:
  Desktop tutorial is active.
- Steps:
  1. Click `Skip tutorial`.
  2. In the confirmation dialog, first test `Continue tutorial` and confirm the tutorial resumes.
  3. Reopen `Skip tutorial`.
  4. Test `Skip and keep data`.
  5. Reset the environment and repeat the tutorial entry flow.
  6. Reopen `Skip tutorial`.
  7. Test `Skip and clean data`.
- Expected Result:
  `Continue tutorial` closes the dialog and preserves the tutorial. `Skip and keep data` ends the tutorial and leaves current data intact. `Skip and clean data` ends the tutorial, clears tutorial-created data, and leaves the user on a fresh Quests state.
- Possible Fail Scenarios:
  - Dialog buttons perform the wrong action.
  - Tutorial cannot be dismissed or resumed.
  - Data remains when it should be cleaned, or disappears when it should be kept.
- If Test Fails:
  Capture the dialog text, the data count before and after each skip path, and whether the tutorial-seen flag changed unexpectedly.

### QA-08 Quest Creation And Blank-Title Validation

- Objective:
  Verify successful quest creation and negative validation for an empty title.
- Preconditions:
  User is on Quests. Any device type.
- Steps:
  1. Open the quest-creation form.
  2. Submit the form with a blank title and any description.
  3. Confirm the validation message.
  4. Enter a valid title and optional description.
  5. Submit the form again.
- Expected Result:
  Blank submission is rejected with a clear title-required error. Valid submission creates the quest, closes the form, and shows a success toast.
- Possible Fail Scenarios:
  - Empty title is accepted.
  - Validation message is absent or unclear.
  - Valid submission does not create a visible quest.
- If Test Fails:
  Capture the form state before and after submit, the exact validation text or missing text, and any toast copy shown after the valid attempt.

### QA-09 Quest Editing

- Objective:
  Verify that an existing quest can be edited and saved correctly.
- Preconditions:
  At least one quest exists.
- Steps:
  1. Click the edit action on a quest.
  2. Modify the title and description.
  3. Save changes.
  4. Reopen the edited quest if needed to confirm the change.
- Expected Result:
  The edit dialog opens with current values, saves the updated values, closes correctly, and shows a success toast.
- Possible Fail Scenarios:
  - Edit dialog opens empty.
  - Saved data does not persist.
  - Changes affect the wrong quest.
- If Test Fails:
  Record the original and final values, the quest ID or visible quest label, and whether the problem occurs only visually or after a reload as well.

### QA-10 Quest Deletion Including Selected-Today Edge Case

- Objective:
  Verify normal deletion and confirm that deleting the quest selected for today clears the Today state.
- Preconditions:
  At least two quests exist. One of them is selected as today's quest.
- Steps:
  1. Delete a quest that is not selected for today and confirm the action.
  2. Verify the quest disappears and today selection remains unchanged.
  3. Delete the quest that is currently selected for today.
  4. Confirm the action and open the Today page.
- Expected Result:
  Deleting a non-selected quest removes only that quest. Deleting the selected today quest removes the quest and leaves Today in its empty state.
- Possible Fail Scenarios:
  - Confirmation dialog does not appear.
  - Deleted quest remains visible.
  - Today still references a deleted quest.
- If Test Fails:
  Capture the quest list before and after deletion, the selected quest label, and the Today page result. This case is at least major severity if Today keeps referencing removed data.

### QA-11 Set Today's Quest And Replace The Selection

- Objective:
  Verify that a quest can be set as today's quest and later replaced by another quest.
- Preconditions:
  At least two quests exist.
- Steps:
  1. On Quests, mark the first quest as today's quest.
  2. Confirm the quest shows a visual Today state.
  3. Mark a different quest as today's quest.
  4. Open Today.
- Expected Result:
  Only one quest is marked as today's quest at a time. The later selection replaces the earlier one, and Today shows the currently selected quest.
- Possible Fail Scenarios:
  - Multiple quests show as selected simultaneously.
  - Today page shows the wrong quest.
  - The selection does not persist after navigation.
- If Test Fails:
  Capture screenshots of the Quests page before and after replacement and record whether the wrong state is visual only or stored across reloads.

### QA-12 Today Empty State

- Objective:
  Verify the empty Today state when no quest has been selected.
- Preconditions:
  No quest is currently selected for today.
- Steps:
  1. Open `#/today`.
  2. Review the empty-state copy and action.
  3. Use the action to return to Quests.
- Expected Result:
  Today shows a clear empty state explaining that no quest is selected, and the action sends the user back to Quests.
- Possible Fail Scenarios:
  - Empty state does not render.
  - Action is missing or broken.
  - Stale deleted or completed data is displayed instead.
- If Test Fails:
  Capture the current data state and route. If stale data appears, preserve local storage for debugging before cleaning it.

### QA-13 Complete Today's Quest In Normal Use

- Objective:
  Verify normal completion behavior when reflection is optional.
- Preconditions:
  A quest is selected as today's quest. Tutorial is not active.
- Steps:
  1. Open Today.
  2. Leave the reflection field empty.
  3. Click `Complete Quest`.
  4. Open History.
- Expected Result:
  Completion succeeds without a reflection, a success toast appears, today's quest is cleared, and a new history entry is added. Expanding the entry shows `No reflection recorded.`
- Possible Fail Scenarios:
  - Completion is blocked even though tutorial is inactive.
  - Today selection is not cleared.
  - History entry is missing or out of order.
- If Test Fails:
  Record whether tutorial was active, capture the toast or missing toast, and verify whether the failure persists after a reload.

### QA-14 Tutorial Reflection Requirement On Desktop

- Objective:
  Verify that the tutorial-created quest cannot be completed without a reflection during the guided tutorial.
- Preconditions:
  Desktop tutorial is active and the tutorial-created quest is open on Today.
- Steps:
  1. Leave the reflection field empty.
  2. Observe the state of the `Complete Quest` button.
  3. Enter a non-empty reflection.
  4. Observe the button again and complete the quest.
- Expected Result:
  The completion button remains disabled until a non-empty reflection is entered. Once reflection text is present, the button becomes actionable and the tutorial can continue.
- Possible Fail Scenarios:
  - Empty reflection is accepted during the tutorial.
  - Button remains disabled after reflection is entered.
  - Tutorial does not advance after successful completion.
- If Test Fails:
  Capture the current tutorial step, the button state before and after text entry, and the exact reflection value used.

### QA-15 History Review And Expandable Entries

- Objective:
  Verify that completion history renders correctly and that entries expand to show reflections.
- Preconditions:
  At least one completion entry exists.
- Steps:
  1. Open History.
  2. Confirm the completion count is visible.
  3. Click a history entry to expand it.
  4. Click the same entry again to collapse it.
  5. If possible, compare one entry with reflection text and one without reflection text.
- Expected Result:
  History entries render in a readable list, expand and collapse on click, and show either the stored reflection or the no-reflection placeholder.
- Possible Fail Scenarios:
  - Entry does not expand.
  - Reflection text is missing or mismatched.
  - Count does not match the number of recorded completions.
- If Test Fails:
  Capture the visible completion count, the entry title and date shown, and whether the issue affects a single entry or all entries.

### QA-16 History Empty State

- Objective:
  Verify the empty History state when no completions exist.
- Preconditions:
  No completion entries exist.
- Steps:
  1. Open `#/history`.
  2. Review the empty-state copy and its action.
  3. Use the action to go to Today.
- Expected Result:
  History shows an empty state explaining that no completed quests exist and offers a working path to the Today page.
- Possible Fail Scenarios:
  - Empty state is missing.
  - Action is broken.
  - Old history data appears after a reset.
- If Test Fails:
  Record whether the environment was truly clean, capture the route behavior, and preserve any unexpected history data for inspection before clearing it.

### QA-17 Desktop And Mobile Navigation

- Objective:
  Verify that navigation adapts correctly by device class and that all visible navigation actions route correctly.
- Preconditions:
  Test once above `1024px` and once below `1024px`.
- Steps:
  1. On desktop, use Quests, Today, History, and `How it works`.
  2. From the Welcome page on desktop, use the header `Enter App` action and confirm it returns to Quests.
  3. On desktop, open the Backup menu and verify access to Import, Export, and Clean data.
  4. On mobile, use bottom navigation for Quests, Today, and History.
  5. On mobile, open More and verify access to `How it works`, Import data, Export data, and Clean data.
  6. When a quest is selected for today, open Today and use the `Want to change today's quest?` link to return to Quests.
- Expected Result:
  Desktop shows top navigation and backup menu. Mobile shows bottom navigation and a separate More sheet. The Welcome `Enter App` shortcut returns correctly to Quests, and the Today page change link also returns correctly to Quests.
- Possible Fail Scenarios:
  - Wrong navigation model at the wrong breakpoint.
  - Hidden or inaccessible secondary actions.
  - Welcome `Enter App` routes incorrectly or bypasses expected app state.
  - Today page change link is missing or broken.
  - Menu cannot be dismissed correctly on mobile.
- If Test Fails:
  Capture the viewport width, screenshot the navigation model, and record which actions were unreachable or routed incorrectly, including whether the failure affected the Welcome shortcut or the Today-page return link.

### QA-18 Export With Existing Data

- Objective:
  Verify that exporting a populated dataset downloads a JSON backup successfully.
- Preconditions:
  At least one quest or completion exists.
- Steps:
  1. Open Export data from navigation.
  2. Confirm the dialog explains what will be exported.
  3. Click `Export data`.
  4. Verify that a file downloads.
  5. Open the file and confirm it contains `quests`, `todayQuestId`, and `completions`.
- Expected Result:
  A JSON file downloads successfully, the dialog closes, the menu closes if applicable, and a success toast confirms export.
- Possible Fail Scenarios:
  - No file downloads.
  - File contents are malformed or incomplete.
  - Export closes without feedback.
- If Test Fails:
  Preserve the downloaded file if one exists, capture the dialog and toast text, and record whether the issue is browser-specific or reproducible in multiple environments.

### QA-19 Export With No Data

- Objective:
  Verify the negative export case when no data is available.
- Preconditions:
  No quests, no completions, and no selected today quest exist.
- Steps:
  1. Open Export data from navigation.
  2. Review the dialog title and description.
  3. Attempt to use the export button.
- Expected Result:
  The dialog communicates that there is no data to export, and the export button is disabled.
- Possible Fail Scenarios:
  - Export button is enabled incorrectly.
  - Dialog message implies that data exists when it does not.
  - A blank or invalid file downloads.
- If Test Fails:
  Capture the current dataset state, the dialog text, and whether the app misclassified empty state due to stale local storage.

### QA-20 Import Valid Backup And Replace Existing Data

- Objective:
  Verify that a valid backup is accepted and replaces the current local dataset.
- Preconditions:
  One dataset is currently loaded in the app. A different valid exported backup file is available.
- Steps:
  1. Record the current quest count and history count.
  2. Open Import data.
  3. Select or drag the valid backup file.
  4. Wait for validation to complete.
  5. Click `Import data`.
  6. Review Quests, Today, and History.
- Expected Result:
  The file validates, the dialog summarizes quest and history counts, import succeeds, and the app shows the imported dataset rather than the original one.
- Possible Fail Scenarios:
  - Import merges instead of replacing.
  - Valid file is rejected.
  - Imported counts do not match file contents.
- If Test Fails:
  Preserve both the pre-import and post-import state, capture the selected file name, and compare the expected and actual counts without clearing the environment.

### QA-21 Import Invalid Files

- Objective:
  Verify rejection behavior for malformed JSON and structurally invalid backups.
- Preconditions:
  Current local data exists and must remain intact after failure.
- Steps:
  1. Open Import data.
  2. Select an invalid JSON file.
  3. Confirm validation fails and import cannot proceed.
  4. Repeat with a structurally invalid JSON file missing required fields.
  5. Repeat with a JSON file where `todayQuestId` points to a missing quest.
  6. Confirm the current app data still matches the pre-test state.
- Expected Result:
  Each invalid file is rejected with an error message, the import action remains unavailable, and the existing dataset is unchanged.
- Possible Fail Scenarios:
  - Invalid files are accepted.
  - Current data is partially overwritten after a failed validation.
  - Error messaging is absent or misleading.
- If Test Fails:
  Record the exact file type used, the specific validation message shown, and whether any part of the current dataset changed after rejection. Treat unexpected data replacement as critical.

### QA-22 Clean Data Reset From Navigation

- Objective:
  Verify that the navigation clean-data flow wipes both app data and onboarding state.
- Preconditions:
  App contains quests and/or history, and the user is in the main app.
- Steps:
  1. Open `Clean data` from navigation.
  2. Review the confirmation dialog.
  3. Confirm the action.
  4. Observe the redirected route.
  5. Reload the app and confirm the startup route.
- Expected Result:
  The app clears quests, today selection, history, welcome state, and tutorial state, then returns to root and lands on Welcome after redirect.
- Possible Fail Scenarios:
  - Data is not fully cleared.
  - Onboarding remains completed even after reset.
  - User is stranded on a broken route.
- If Test Fails:
  Capture the route before and after reset, note which data remained, and verify whether the failure affects app data, onboarding flags, or both.

### QA-23 Persistence Across Reloads

- Objective:
  Verify that quest data, selected today quest, and history persist across page reloads.
- Preconditions:
  At least one quest exists, one quest is selected for today, and one completion entry exists.
- Steps:
  1. Record the visible quest list, today quest, and history count.
  2. Reload the page.
  3. Visit Quests, Today, and History again.
- Expected Result:
  The same state is restored after reload with no data loss or duplicate records.
- Possible Fail Scenarios:
  - Data disappears after reload.
  - Today selection changes unexpectedly.
  - Duplicate history entries appear.
- If Test Fails:
  Capture the before-and-after counts and inspect local storage before clearing it. This case is critical if persistent data disappears or duplicates unexpectedly.

### QA-24 Recovery From Corrupted Stored Data

- Objective:
  Verify that the app recovers safely if the main stored JSON becomes invalid.
- Preconditions:
  Browser storage tools are available.
- Steps:
  1. Manually set `microquest-data` to invalid JSON in local storage.
  2. Reload the application.
  3. Observe the restored app state.
- Expected Result:
  The app does not crash. It falls back to the default starter-quest state and continues functioning normally.
- Possible Fail Scenarios:
  - White screen or unhandled exception.
  - App gets stuck in a broken state.
  - Stored corruption causes partial rendering.
- If Test Fails:
  Capture console output immediately, preserve the corrupted storage value used, and record whether the failure occurs only in one browser or across environments.

### QA-25 Not-Found Route Handling

- Objective:
  Verify the fallback behavior for unmatched routes.
- Preconditions:
  Any valid browser environment.
- Steps:
  1. Manually open an invalid hash route such as `#/does-not-exist`.
  2. Review the not-found page.
  3. Use the recovery action to return to Quests.
- Expected Result:
  The app shows a 404-style not-found page with a recovery action. The recovery action routes back to Quests successfully.
- Possible Fail Scenarios:
  - Blank screen instead of a fallback page.
  - Recovery link is broken.
  - Invalid route loops endlessly.
- If Test Fails:
  Capture the entered route, the rendered page content, and any console errors associated with route resolution.

## 7. Coverage Check For Required Negative Cases

The following release-critical negative scenarios must be executed and signed off:

| Negative Scenario | Covered By |
| --- | --- |
| Blank-title validation | QA-08 |
| Deleting the selected today quest | QA-10 |
| Export when no data exists | QA-19 |
| Invalid JSON import | QA-21 |
| Invalid backup structure | QA-21 |
| Backup references missing `todayQuestId` | QA-21 |
| Import replaces current data | QA-20 |
| Tutorial reflection required on desktop | QA-14 |
| Empty Today state | QA-12 |
| Empty History state | QA-16 |
| Recovery from corrupted local storage | QA-24 |

## 8. Release Exit Criteria

The release is ready only when all conditions below are met:

1. All high-priority manual cases in this document have passed in the required environments.
2. No blocker or critical defects remain open.
3. Any major defects have a documented decision, workaround, and explicit release approval from the project owner.
4. Desktop tutorial behavior has been verified above the `1024px` breakpoint.
5. Mobile navigation and action-sheet behavior have been verified below the `1024px` breakpoint.
6. Import, export, clean-data reset, and persistence behavior have been validated successfully at least once on desktop and once on mobile.
7. Route coverage has been confirmed for `#/welcome`, `#/quests`, `#/today`, `#/history`, and an unmatched fallback route.

## 9. Final QA Sign-Off Checklist

- Welcome and onboarding are understandable and functional.
- Desktop tutorial progresses, skips, and cleans data correctly.
- Mobile onboarding bypasses tutorial correctly.
- Quest CRUD works reliably.
- Today selection and completion behavior are correct.
- History states are correct and expandable.
- Navigation is responsive and complete.
- Import, export, and clean-data flows are safe.
- Reload persistence works.
- Corrupted local storage does not break the app.
- Fallback routing works.

If any item above cannot be checked as complete, the release should remain in pre-production until the risk is resolved or formally accepted.
