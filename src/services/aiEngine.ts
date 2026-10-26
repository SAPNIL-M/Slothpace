import { DayPlan, ScheduledTask, SubTask, TaskType, CognitiveDifficulty } from '../types';

// Sloth wisdom quotes for pacing and anti-burnout
export const SLOTH_QUOTES = [
  { quote: "The tree that climbs slowly reaches the sun just the same.", author: "Sloth Proverb" },
  { quote: "Focus on one branch at a time. The rest of the canopy will wait.", author: "Mindful Pacing" },
  { quote: "Slow and steady isn't lazy. It's the art of doing things once, properly.", author: "Hacktoberfest 2026" },
  { quote: "Breaks are not rewards for finishing; they are the fuel to keep climbing.", author: "Zen Ergonomics" },
  { quote: "A chaotic mountain is just a pile of 10-minute pebbles.", author: "SlothPace" },
];

const DEEP_WORK_KEYWORDS = [
  'fix', 'bug', 'debug', 'architect', 'refactor', 'implement', 'algorithm', 
  'write', 'code', 'research', 'analyze', 'design', 'test', 'security', 
  'database', 'sql', 'docker', 'api', 'backend', 'performance', 'complex',
  'optimize', 'study', 'exam', 'paper', 'draft', 'migration', 'auth'
];

const EASY_WORK_KEYWORDS = [
  'email', 'reply', 'send', 'call', 'check', 'message', 'slack', 'buy', 
  'order', 'organize', 'clean', 'format', 'submit', 'upload', 'schedule', 
  'invoice', 'pay', 'sync', 'status', 'rename', 'archive', 'read', 'review pr'
];

interface NLPClassificationResult {
  category: TaskType;
  difficulty: CognitiveDifficulty;
  durationMinutes: number;
  cognitiveEnergy: number;
  subtasks: string[];
  slothTip: string;
}

// Client-side NLP Analyzer for task decomposition
function analyzeTaskWithLocalNLP(rawTask: string, index: number): NLPClassificationResult {
  const lower = rawTask.toLowerCase().trim();

  let deepScore = 0;
  let easyScore = 0;

  DEEP_WORK_KEYWORDS.forEach(kw => {
    if (lower.includes(kw)) deepScore += 2;
  });

  EASY_WORK_KEYWORDS.forEach(kw => {
    if (lower.includes(kw)) easyScore += 2;
  });

  // Length or complexity indicators
  const words = lower.split(/\s+/).length;
  if (words > 12) deepScore += 1;
  if (words <= 5) easyScore += 1;

  // Determine category
  const isDeep = deepScore > easyScore || (deepScore === easyScore && index % 2 === 0);
  const category: TaskType = isDeep ? 'DEEP' : 'EASY';

  // Determine duration and difficulty
  let durationMinutes = 30;
  let difficulty: CognitiveDifficulty = 'MEDIUM';
  let cognitiveEnergy = 3;

  if (category === 'DEEP') {
    if (deepScore >= 4 || words > 10) {
      durationMinutes = 45;
      difficulty = 'HIGH';
      cognitiveEnergy = 5;
    } else {
      durationMinutes = 35;
      difficulty = 'MEDIUM';
      cognitiveEnergy = 4;
    }
  } else {
    if (easyScore >= 4 || words <= 4) {
      durationMinutes = 15;
      difficulty = 'LOW';
      cognitiveEnergy = 1;
    } else {
      durationMinutes = 20;
      difficulty = 'LOW';
      cognitiveEnergy = 2;
    }
  }

  // Decompose task into concrete 5-15 minute micro-steps
  const subtasks = generateMicroSteps(rawTask, category);

  // Generate a comforting sloth tip
  const slothTip = generateSlothTip(category, rawTask);

  return {
    category,
    difficulty,
    durationMinutes,
    cognitiveEnergy,
    subtasks,
    slothTip,
  };
}

// Generate actionable bite-sized subtasks
function generateMicroSteps(taskText: string, category: TaskType): string[] {
  const lower = taskText.toLowerCase();

  if (lower.includes('bug') || lower.includes('fix') || lower.includes('debug')) {
    return [
      'Reproduce the issue locally with a minimal test case (10m)',
      'Inspect relevant logs, stack traces, and variables (15m)',
      'Apply the fix and verify against edge cases (15m)',
      'Commit with a clean descriptive message (5m)',
    ];
  }

  if (lower.includes('write') || lower.includes('post') || lower.includes('doc') || lower.includes('article') || lower.includes('paper')) {
    return [
      'Jot down a quick 3-point outline and key takeaways (10m)',
      'Draft the core section without editing or self-critique (20m)',
      'Add examples, code snippets, or references (15m)',
      'Read aloud once for flow and clarity (5m)',
    ];
  }

  if (lower.includes('email') || lower.includes('message') || lower.includes('slack') || lower.includes('reply')) {
    return [
      'Clarify the main 1-2 decisions needed from them (5m)',
      'Draft a concise response (under 150 words) (5m)',
      'Double check recipient address and hit send (2m)',
    ];
  }

  if (lower.includes('review') || lower.includes('pr') || lower.includes('pull request')) {
    return [
      'Read the PR description and understand the motivation (5m)',
      'Check logic, edge cases, and test coverage (15m)',
      'Leave kind, constructive feedback or approve (5m)',
    ];
  }

  if (lower.includes('clean') || lower.includes('buy') || lower.includes('order') || lower.includes('pay') || lower.includes('invoice')) {
    return [
      'Gather required links, receipts, or items (5m)',
      'Execute the chore without opening other tabs (10m)',
      'Mark as done and clear your workspace (3m)',
    ];
  }

  // General fallback decomposition
  if (category === 'DEEP') {
    return [
      `Set up workspace and define what "done" looks like for "${taskText.slice(0, 30)}..." (5m)`,
      'Tackle the hardest core problem in uninterrupted focus (25m)',
      'Test, clean up, and write down next handoff notes (10m)',
    ];
  } else {
    return [
      `Quick prep: open the specific tab/tool needed (3m)`,
      `Complete the primary action item (10m)`,
      `Verify and check off the list (2m)`,
    ];
  }
}

function generateSlothTip(category: TaskType, text: string): string {
  if (category === 'DEEP') {
    const tips = [
      "Deep focus mode. Close all Slack/email tabs. The branch is steady; take your time.",
      "Don't worry about perfection on the first pass. Just get the core structure in place.",
      "If you feel stuck, breathe deeply and take a 60-second stretch. Answers appear when you decelerate.",
      "Break the monolithic thinking. You only have to complete the very next sub-step right now."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  } else {
    const tips = [
      "Light and breezy. Don't overthink this one; knock it out and enjoy the momentum.",
      "Quick win! Completing this will release gentle dopamine for the next climb.",
      "Batch this with minimum friction so your mind stays fresh for creative thinking."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }
}

// Helper to format 12-hour AM/PM time
function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const minsStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minsStr} ${ampm}`;
}

// Convert "09:30" or Date into working Date object
function parseInitialTime(timeStr?: string): Date {
  const now = new Date();
  if (!timeStr) return now;

  const [hours, minutes] = timeStr.split(':').map(Number);
  if (!isNaN(hours) && !isNaN(minutes)) {
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
  }
  return now;
}

/**
 * Main Day Plan Generator:
 * Takes chaotic user brain-dump, runs open-source decomposition, 
 * interleaves restorative Sloth breaks, and calculates a sane schedule.
 */
export async function generateDayPlan(
  rawInput: string,
  startTimeStr?: string,
  paceStyle: 'gentle' | 'steady' | 'sprint' = 'steady'
): Promise<DayPlan> {
  // Split raw text by newlines, bullets, semicolons, or numbered lists
  const rawLines = rawInput
    .split(/\n|;|\r/)
    .map(l => l.replace(/^[-*•\d+.)\s]+/, '').trim())
    .filter(l => l.length > 2);

  if (rawLines.length === 0) {
    throw new Error("Please enter at least one task or note to pace your day.");
  }

  let currentTime = parseInitialTime(startTimeStr);
  const tasks: ScheduledTask[] = [];

  let deepWorkMinutes = 0;
  let easyWorkMinutes = 0;
  let totalBreakMinutes = 0;

  // Pace multiplier
  // gentle: longer breaks and buffers
  // steady: standard 10m breaks after deep work
  // sprint: concise 5m pauses
  const breakDuration = paceStyle === 'gentle' ? 15 : paceStyle === 'steady' ? 10 : 5;

  let consecutiveDeepMinutes = 0;

  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i];
    const analysis = analyzeTaskWithLocalNLP(rawLine, i);

    // If user has done 60+ minutes of deep work, schedule an automatic Sloth Recharge Break!
    if (consecutiveDeepMinutes >= 55) {
      const breakStart = new Date(currentTime);
      const breakEnd = new Date(breakStart.getTime() + breakDuration * 60000);

      tasks.push({
        id: `break-${Date.now()}-${i}`,
        title: '🦥 Sloth Recharge & Eye Rest',
        description: 'Step away from screens. Hydrate, look out a window, or stretch your back gently.',
        rawInput: 'Sloth Pause',
        category: 'BREAK',
        difficulty: 'LOW',
        durationMinutes: breakDuration,
        startTime: formatTime(breakStart),
        endTime: formatTime(breakEnd),
        subtasks: [
          { id: `b-${i}-1`, title: 'Drink a glass of water or herbal tea', completed: false, estimatedMinutes: 3 },
          { id: `b-${i}-2`, title: '20-20-20 eye relaxation (look at something 20 feet away)', completed: false, estimatedMinutes: 2 },
          { id: `b-${i}-3`, title: 'Slow deep breathing (4 seconds in, 6 seconds out)', completed: false, estimatedMinutes: 5 }
        ],
        status: 'pending',
        slothTip: "Sloths sleep 15 hours a day. You only need 10 minutes to reset your focus.",
        cognitiveEnergy: 0,
      });

      totalBreakMinutes += breakDuration;
      currentTime = breakEnd;
      consecutiveDeepMinutes = 0;
    }

    const taskStart = new Date(currentTime);
    const taskEnd = new Date(taskStart.getTime() + analysis.durationMinutes * 60000);

    const subtasksList: SubTask[] = analysis.subtasks.map((st, subIdx) => ({
      id: `sub-${i}-${subIdx}-${Date.now()}`,
      title: st,
      completed: false,
      estimatedMinutes: Math.round(analysis.durationMinutes / analysis.subtasks.length),
    }));

    tasks.push({
      id: `task-${i}-${Date.now()}`,
      title: rawLine.length > 60 ? `${rawLine.slice(0, 57)}...` : rawLine,
      description: `Paced into ${analysis.category === 'DEEP' ? 'Deep Focus' : 'Easy Work'} flow.`,
      rawInput: rawLine,
      category: analysis.category,
      difficulty: analysis.difficulty,
      durationMinutes: analysis.durationMinutes,
      startTime: formatTime(taskStart),
      endTime: formatTime(taskEnd),
      subtasks: subtasksList,
      status: 'pending',
      slothTip: analysis.slothTip,
      cognitiveEnergy: analysis.cognitiveEnergy,
    });

    if (analysis.category === 'DEEP') {
      deepWorkMinutes += analysis.durationMinutes;
      consecutiveDeepMinutes += analysis.durationMinutes;
    } else {
      easyWorkMinutes += analysis.durationMinutes;
      consecutiveDeepMinutes = Math.max(0, consecutiveDeepMinutes - 10);
    }

    currentTime = taskEnd;
  }

  // Final celebration / cooldown block if multiple tasks
  if (tasks.length >= 2) {
    const finalBreakStart = new Date(currentTime);
    const finalBreakEnd = new Date(finalBreakStart.getTime() + 10 * 60000);
    tasks.push({
      id: `break-final-${Date.now()}`,
      title: '🍃 Day Complete & Gentle Reflection',
      description: 'Review what you accomplished slowly and steadily. Close tabs and unplug.',
      rawInput: 'Final Chill',
      category: 'BREAK',
      difficulty: 'LOW',
      durationMinutes: 10,
      startTime: formatTime(finalBreakStart),
      endTime: formatTime(finalBreakEnd),
      subtasks: [
        { id: `bf-1`, title: 'Check off your completed milestones', completed: false, estimatedMinutes: 3 },
        { id: `bf-2`, title: 'Celebrate: You did it without frantic rushing!', completed: false, estimatedMinutes: 7 }
      ],
      status: 'pending',
      slothTip: "The day is done. Rest is not laziness—it is essential maintenance.",
      cognitiveEnergy: 0,
    });
    totalBreakMinutes += 10;
  }

  return {
    id: `plan-${Date.now()}`,
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
    startTime: startTimeStr || formatTime(parseInitialTime()),
    paceStyle,
    tasks,
    totalWorkMinutes: deepWorkMinutes + easyWorkMinutes,
    totalBreakMinutes,
    deepWorkMinutes,
    easyWorkMinutes,
  };
}

/**
 * Recalculate timeline times dynamically when user adds buffer or marks delays
 */
export function shiftTaskSchedule(tasks: ScheduledTask[], fromIndex: number, additionalMinutes: number): ScheduledTask[] {
  const updated = [...tasks];

  for (let i = fromIndex; i < updated.length; i++) {
    const task = updated[i];
    // parse current startTime and endTime and add additionalMinutes
    const [startH, startM, startAmpm] = parseTimeComponents(task.startTime);
    const [endH, endM, endAmpm] = parseTimeComponents(task.endTime);

    const sDate = new Date();
    sDate.setHours(convertTo24(startH, startAmpm), startM + additionalMinutes, 0, 0);

    const eDate = new Date();
    eDate.setHours(convertTo24(endH, endAmpm), endM + additionalMinutes, 0, 0);

    updated[i] = {
      ...task,
      startTime: formatTime(sDate),
      endTime: formatTime(eDate)
    };
  }

  return updated;
}

function parseTimeComponents(timeStr: string): [number, number, string] {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (match) {
    return [parseInt(match[1]), parseInt(match[2]), match[3].toUpperCase()];
  }
  return [9, 0, 'AM'];
}

function convertTo24(hours: number, ampm: string): number {
  if (ampm === 'PM' && hours < 12) return hours + 12;
  if (ampm === 'AM' && hours === 12) return 0;
  return hours;
}
