# E2E User Paths Inventory (QA-01 to QA-25)

Canonical source: `docs/qa-test-plan.md`  
Execution order is strict and follows QA-01 through QA-25.

| Order | QA ID | Path / Flow | Pages Touched | Device Scope |
| --- | --- | --- | --- | --- |
| 1 | QA-01 | First launch routes to Welcome | welcome | desktop |
| 2 | QA-02 | Welcome primary start flow and tutorial entry | welcome, quests | desktop |
| 3 | QA-03 | Welcome secondary flow keeps existing data | welcome, quests | both |
| 4 | QA-04 | Welcome secondary flow clears and starts fresh | welcome, quests, today, history | both |
| 5 | QA-05 | First launch on mobile without tutorial | welcome, quests | mobile |
| 6 | QA-06 | Full desktop tutorial progression | quests, today, history | desktop |
| 7 | QA-07 | Desktop tutorial skip paths (continue/keep/clean) | quests | desktop |
| 8 | QA-08 | Quest creation and blank-title validation | quests | both |
| 9 | QA-09 | Quest editing | quests | both |
| 10 | QA-10 | Quest deletion and selected-today edge case | quests, today | both |
| 11 | QA-11 | Set today quest and replace selection | quests, today | both |
| 12 | QA-12 | Today empty state and recovery action | today, quests | both |
| 13 | QA-13 | Complete today quest with optional reflection | today, history | both |
| 14 | QA-14 | Tutorial reflection required on desktop | quests, today | desktop |
| 15 | QA-15 | History entry review and expand/collapse | history | both |
| 16 | QA-16 | History empty state and action routing | history, today | both |
| 17 | QA-17 | Responsive navigation and shortcuts | welcome, quests, today, history | both |
| 18 | QA-18 | Export with existing data | quests | both |
| 19 | QA-19 | Export with no data | quests | both |
| 20 | QA-20 | Import valid backup replaces current data | quests, today, history | both |
| 21 | QA-21 | Import invalid files and preserve current data | quests | both |
| 22 | QA-22 | Clean-data reset from navigation | quests, welcome | both |
| 23 | QA-23 | Persistence across reloads | quests, today, history | both |
| 24 | QA-24 | Recovery from corrupted stored data | quests | both |
| 25 | QA-25 | Not-found route handling and recovery | not-found, quests | both |

