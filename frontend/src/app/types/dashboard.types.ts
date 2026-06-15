export interface Profile{
	id: number;
	username: string;
}

export interface CharacterStats {
  energyScore: number;
  healthScore: number;
  completionRate: number;
  totalActiveTasks: number;
}

export interface TaskSummary {
  id: number;
  noteId: number | null;
  noteTitle: string | null;
  title: string;
  position: number;
  urgencyTier: 'LIGHT' | 'MEDIUM' | 'IMPORTANT' | 'HEAVY' | 'IMPACTFUL';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  createdAt: string;
}

export interface NoteInventoryTree {
  id: string;
  title: string;
  category: 'PROJECT' | 'LEARNING' | 'BRAINDUMP';
  tasks: TaskSummary[];
}

export interface NoteCreationEdit {
  id: string | null
  title: string;
  content: string;
  category: 'PROJECT' | 'LEARNING' | 'BRAINDUMP' | 'HOBBY';
}

export interface Note{
  noteSummary: NoteInventoryTree;
  content: string;
}

export interface DashboardData {
  characterStats: CharacterStats;
  notes: NoteInventoryTree[];
  inboxTasks: TaskSummary[];
}