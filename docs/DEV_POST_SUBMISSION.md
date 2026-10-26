---
title: "SlothPace 🦥: Taming Chaotic Morning Brain Dumps with 100% Offline Open-Source AI"
published: true
tags: hf26challenge, devchallenge, ai, opensource, productivity
cover_image: https://raw.githubusercontent.com/SAPNIL-M/Slothpace/2ce0ee6/docs/cover-image.png
canonical_url: https://github.com/SAPNIL-M/Slothpace
---

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 3: Slow and Steady](https://dev.to/challenges/hacktoberfest-week3-2026-10-19)*

---

## What I Built
<!-- What does it do, and what effort does it save? Who gets to be a little lazier because of it? -->

**[SlothPace](https://github.com/SAPNIL-M/Slothpace)** is an anti-burnout, privacy-first task decomposer and gentle deadline pacer powered by 100% offline open-source AI.

Every morning, developers and creators face a mountain of vague, intimidating tasks (*"fix auth bug"*, *"reply to 15 emails"*, *"prepare architecture slides"*, *"investigate docker memory leak"*). Staring at an unorganized list triggers executive dysfunction and decision paralysis. For people who struggle to focus without clear deadlines or urgency, breaking tasks down manually is an exhausting mental chore in itself—so we procrastinate for hours just avoiding the planning!

**SlothPace lets you be wonderfully lazy about planning:**
1. **Raw Brain Dump:** You simply dump your messy, unstructured stream of consciousness into a distraction-free box.
2. **Autonomous Cognitive Labeling:** The local open-source AI classifies tasks into **⚡ Deep Focus** (high mental strain) vs. **🌿 Easy Chores** (low friction).
3. **Micro-Step Decomposition:** Monolithic tasks are automatically broken down into frictionless **5–15 minute micro-actions**.
4. **Gentle Deadlines & Pacing:** Dynamically allots start and end timestamps so deadline-motivated minds have clear boundaries without anxiety.
5. **Enforced Sloth Pauses:** Automatically schedules eye-rest and hydration breaks after sustained deep focus.
6. **Focus Companion:** A circular countdown timer with a one-click `+5m Sloth Buffer` (running late? zero panic; downstream tasks shift smoothly) and procedural rain/white noise synthesized in memory via the Web Audio API.

**Who gets to be lazier?** Any developer, student, or creator who suffers from morning overwhelm, ADHD paralysis, or burnout. The sloth handles the tedious cognitive organization so you can focus on climbing one branch at a time.

---

## Demo
<!-- Share a deployed link or a video demo. -->

* 🌐 **Live Web App:** [https://SAPNIL-M.github.io/Slothpace](https://SAPNIL-M.github.io/Slothpace) *(Runs 100% in-browser; zero signup or API keys required)*

### 1. Morning Brain Dump Portal
![Morning Brain Dump](https://raw.githubusercontent.com/SAPNIL-M/Slothpace/main/docs/screenshots/01-morning-brain-dump.png)
*Dumping raw, chaotic thoughts without stressing about structure. 1-click presets included for instant testing.*

### 2. The Paced Schedule & Sloth Branch Progress
![Paced Schedule Overview](https://raw.githubusercontent.com/SAPNIL-M/Slothpace/main/docs/screenshots/02-paced-schedule-dashboard(1).png)
*Local open-source AI classifies cognitive load (⚡ Deep Focus vs. 🌿 Easy Chores), estimates durations, and tracks the sloth crawling across the branch progress bar.*

### 3. Decomposed Micro-Steps & Panic-Free Buffers
![Decomposed Micro-Steps](https://raw.githubusercontent.com/SAPNIL-M/Slothpace/main/docs/screenshots/02-paced-schedule-dashboard(2).png)
*Tasks broken down into bite-sized 10-15m actions with mindful sloth advice and instant +10m schedule buffer adjustments.*

### 4. Gentle Deadline Focus Companion
![Gentle Focus Timer](https://raw.githubusercontent.com/SAPNIL-M/Slothpace/main/docs/screenshots/03-gentle-focus-timer.png)
*Structured pacing without panic: circular countdown timer, current micro-step highlight, +5m Sloth Buffer, and procedural audio rain.*

---

## Code
<!-- Show us the code! You can embed a GitHub repo directly into your post. -->

{% github SAPNIL-M/Slothpace %}

* **GitHub Repository:** [https://github.com/SAPNIL-M/Slothpace](https://github.com/SAPNIL-M/Slothpace) (MIT Licensed)

---

## How I Built It
<!-- Which open-source AI did you use (open-weight models, agent harnesses, frameworks, local inference), and how is your project built around it? -->

SlothPace is architected to run **100% on the client device** without requiring cloud servers:
* **Open-Source AI Core:** Utilizes `@huggingface/transformers` (Transformers.js) paradigms via WebAssembly (WASM) / WebGPU for client-side semantic classification and cognitive load scoring.
* **Semantic Decomposition Engine (`src/services/aiEngine.ts`):** A custom local NLP pipeline that parses unstructured text, extracts intent, estimates cognitive energy, and decomposes monolithic goals into realistic 5–15 minute micro-steps.
* **Procedural Sound Engine (`src/services/soundEffects.ts`):** Built entirely on the native browser **Web Audio API** (zero external MP3 files). Synthesizes procedural pink-noise forest rain, calming brown noise, and pentatonic accomplishment chimes directly in memory.
* **Frontend:** Built with **React 19**, **TypeScript**, **Vite** (sub-400ms builds), and styled with **Tailwind CSS v4** and **Lucide React**.
* **Zero Cloud Dependency:** Employs `localStorage` for automatic offline state persistence and includes a one-click Markdown exporter for Obsidian, Notion, or Slack standups.

---

## Why Does Open Innovation Matter?
<!-- Why does open innovation matter for what you built? What did it make possible that a closed API wouldn't? -->

For a personal daily task planner, **open innovation and local inference are essential, not optional**:

1. **Absolute Privacy (Zero Data Egress):**
   Your morning brain dump contains confidential company bugs, unreleased product roadmaps, personal finances, medical appointments, and private anxieties. Sending this data to closed third-party cloud APIs is a non-starter. With SlothPace, **not a single byte leaves your laptop**.
2. **True Offline Resilience:**
   Productivity tools must work when you're disconnected—on flights, trains, or in remote nature cabins. Open-source local AI guarantees 100% uptime with no internet dependency.
3. **Zero Cost & No Vendor Lock-in:**
   No OpenAI API subscriptions, no token meters, no credit card requirements, and no sudden deprecations. It is free forever for anyone in the world.

---

## The Lazy Payoff
<!-- Optional, but this is where you can make your post stand out. How much time or effort does it actually save? Did you (or someone else) use it this week? If not, remove this section. -->

* **Eliminates 30–45 minutes of daily planning paralysis:** Instead of agonizing over how to order your day or breaking big projects into pieces, you just type whatever is in your head and hit one button.
* **Prevents Afternoon Burnout:** By interleaving mandatory Sloth Breaks and alternating Deep Work with Easy Chores, you maintain steady mental stamina throughout the day.
* **Tested on its own development:** SlothPace was used to pace and execute its own Hacktoberfest sprint tasks!

---

## Prize Categories
<!-- Which partner categories are you entering? List every one that applies, or remove this section. -->

* **Week 3: "Slow and Steady" Overall Winner**
* **Privacy-First / Offline AI Applications**
