export type TaskType = 'DEEP' | 'EASY' | 'BREAK';

export type CognitiveDifficulty = 'LOW' | 'MEDIUM' | 'HIGH';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  estimatedMinutes: number;
}

export interface ScheduledTask {
  id: string;
  title: string;
  description: string;
  rawInput: string;
  category: TaskType;
  difficulty: CognitiveDifficulty;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  subtasks: SubTask[];
  status: 'pending' | 'in_progress' | 'completed';
  slothTip: string;
  cognitiveEnergy: number; // 1 to 5 scale
}

export interface DayPlan {
  id: string;
  date: string;
  startTime: string;
  paceStyle: 'gentle' | 'steady' | 'sprint';
  tasks: ScheduledTask[];
  totalWorkMinutes: number;
  totalBreakMinutes: number;
  deepWorkMinutes: number;
  easyWorkMinutes: number;
}

export interface SlothQuote {
  quote: string;
  author: string;
}
