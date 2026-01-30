# MicroQuest App

A small React app to create “quests”, pick one quest for today, complete it with a short reflection, and review completion history.

This project exists as part of an Agile/Scrum practice assignment using Trello (solo Scrum), but the app is fully runnable and deployable.

---

## Features (MVP)

- Quests: create, view, edit, delete
- Today: pick one quest for today and complete it with a reflection
- History: view completed quests (date + reflection)
- Persistence: localStorage (no accounts / no backend)

---

## Tech Stack

- React + Vite
- React Router
- localStorage for persistence

---

## Local Development

### Prerequisites
- Node.js 18+ recommended
- npm (or pnpm/yarn)

### Run
```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Build
```bash
npm run build
npm run preview
```