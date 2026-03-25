# QA-21 Import Invalid Files

## Automated Test List
- [ ] Seed baseline dataset to confirm data preservation on failures.
- [ ] Upload malformed JSON and verify validation error with disabled import action.
- [ ] Upload structurally invalid backup and verify validation error.
- [ ] Upload backup with missing `todayQuestId` reference and verify validation error.
- [ ] Verify original baseline data remains unchanged.

