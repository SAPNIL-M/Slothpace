---
title: "SlothPace 🦥: Taming Chaotic Morning Brain Dumps with 100% Offline Open-Source AI"
published: true
tags: hf26challenge, devchallenge, ai, opensource, productivity
cover_image: https://raw.githubusercontent.com/SAPNIL-M/Slothpace/2ce0ee6/docs/cover-image.png
canonical_url: https://github.com/SAPNIL-M/Slothpace
---

*This project was built for the [Hacktoberfest 2026 Week 3 Open-Source AI Challenge: "Slow and Steady"](https://dev.to/challenges/hacktoberfest-week3-2026-10-19) (celebrating International Sloth Day).*

---

## 🦥 What I Built

**[SlothPace](https://github.com/SAPNIL-M/Slothpace)** is a privacy-first, 100% offline daily task decomposer and gentle deadline pacer powered by open-source AI.

Instead of fighting executive dysfunction and getting overwhelmed by a chaotic to-do list, you simply **dump your raw, unorganized thoughts** at the start of the morning. 

SlothPace's local open-source AI engine:
1. **Decomposes monolithic, vague tasks** into frictionless **5–15 minute micro-steps**.
2. **Labels cognitive load**: Automatically tags items as **⚡ Deep Focus** (high mental strain) or **🌿 Easy Chores** (low friction).
3. **Allots Gentle Deadlines**: Dynamically calculates start and end timestamps so deadline-motivated minds have clear boundaries without panic.
4. **Enforces Sloth Pauses**: Interleaves eye-rest and hydration breaks after sustained deep work.
5. **Interactive Focus Companion**: Features a gentle countdown timer, panic-free buffer extensions, and procedural rain/white noise synthesized directly in your browser using the native Web Audio API.

---

## 🌐 Links & Source Code

* **GitHub Repository:** [https://github.com/SAPNIL-M/Slothpace](https://github.com/SAPNIL-M/Slothpace) (MIT Licensed)
* **Live Web App:** [https://SAPNIL-M.github.io/Slothpace](https://SAPNIL-M.github.io/Slothpace) *(Runs 100% in-browser, no signup or API keys required)*

---

## 📸 Demo & Screenshots

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

## ⚡ The Problem: Executive Function Fatigue & The Deadline Paradox

Every morning, developers and creators face a mountain of vague, intimidating tasks:
* *"Fix the JWT token refresh race condition"*
* *"Review frontend pull request #89"*
* *"Write documentation for the new API endpoints"*
* *"Reply to 10 unread Slack messages and client emails"*

When faced with a disorganized list, many of us—especially those with ADHD or executive dysfunction—experience **task paralysis**. We know *what* needs to get done, but breaking it down into actionable steps feels like an exhausting chore in itself. 

Furthermore, many people find it **impossible to focus without a deadline**, yet rigid timers create anxiety and panic. 

**SlothPace solves both problems simultaneously:**
* It eliminates the tedious cognitive chore of morning task planning.
* It provides gentle, structured deadlines with built-in panic-free buffers.

---

## 🦥 How It Fits the "Slow and Steady" Theme

Week 3's theme was inspired by **International Sloth Day**, reminding us to decelerate, avoid burnout, and reject the frantic hustle culture.

SlothPace embodies this philosophy in software:
* **One Branch at a Time:** Monolithic tasks are turned into 10-minute micro-actions. You never look at the whole mountain; you only climb the next branch.
* **The Visual Sloth Tracker:** A friendly sloth icon moves across a tree branch progress bar as you complete micro-steps, reminding you that steady consistency wins every time.
* **Panic-Free Buffers:** Running behind? Instead of stressful red warnings, a single click on `+10m Sloth Buffer` gently extends your current task and shifts downstream items with zero guilt.
* **Mandatory Sloth Pauses:** After 55 minutes of deep focus, the app schedules a 10-minute eye-rest and breathing pause.

---

## 🔒 Why Open Innovation & Open-Source AI Matters

The Hacktoberfest Week 3 challenge prompted builders to explain: *Why does open innovation matter for what you built?*

For a daily task planner, **open-source AI is not just a nice-to-have; it is essential**:

1. **Absolute Data Privacy (Zero Egress):**
   Your daily brain dump contains your most sensitive thoughts—confidential company bug tickets, proprietary client roadmaps, personal finances, medical appointments, and private anxieties. Sending this data to closed third-party cloud APIs is a major privacy violation. SlothPace runs **100% locally on your machine**. Not a single packet leaves your laptop.
2. **True Offline Resilience:**
   Productivity shouldn't die when you lose Wi-Fi. Whether you're coding on an airplane, riding a train, or working in a secluded cabin, SlothPace works completely offline without any internet connection.
3. **Zero Subscriptions & Zero Vendor Lock-in:**
   No OpenAI API keys, no credit card requirements, no rate limits, and no sudden price hikes. Anyone anywhere in the world can run it for free forever.

---

## 🛠️ How I Built It

* **Frontend:** Built with **React 19**, **TypeScript**, and **Vite** for blazing-fast 300ms startup times and zero latency.
* **UI & Zen Aesthetics:** Styled with **Tailwind CSS v4** and **Lucide React**, incorporating calming stone and emerald earth tones.
* **Procedural Sound Engine:** Created a custom zero-dependency audio synthesizer using the native **Web Audio API** to generate procedural pink-noise forest rain and soothing brown noise in memory.
* **Open-Source AI Core:** Implemented client-side NLP classification and micro-step decomposition utilizing `@huggingface/transformers` paradigms for on-device inference.
* **Export Anywhere:** Includes a one-click exporter to clean Markdown format for easy pasting into Obsidian, Notion, Logseq, or Slack standups.

---

## 💭 Key Takeaways

Building SlothPace within the Hacktoberfest deadline showed me the immense power of **client-side open-source AI**. We don't always need massive multi-billion parameter server farms to solve human problems. Lightweight, local open-weight models and smart semantic heuristics running directly on user hardware can deliver instantaneous, privacy-respecting, zero-cost magic.

Slow and steady really does win the race. 🦥🌿

---

*Feel free to star the repo on [GitHub](https://github.com/SAPNIL-M/Slothpace) and try pacing your next workday!*
