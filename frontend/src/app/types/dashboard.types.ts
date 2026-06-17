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
  id: string;
  noteId: number | null;
  noteTitle: string | null;
  title: string;
  position: number;
  urgencyTier: 'LIGHT' | 'MEDIUM' | 'IMPORTANT' | 'HEAVY' | 'IMPACTFUL';
  status: 'TODO' | 'PROGRESS' | 'REVIEW' | 'DONE'
  createdAt: string;
}

export interface NoteInventoryTree {
  id: string;
  title: string;
  category: 'PROJECT' | 'LEARNING' | 'BRAINDUMP';
  tasks: TaskSummary[];
}

export interface Task {
  id: string | null;
  noteId: string | null;
  noteTitle: string | null
  title: string;
  description: string;
  position: string;
  urgencyTier: 'LIGHT' | 'MEDIUM' | 'IMPORTANT' | 'HEAVY' | 'IMPACTFUL';
  status: 'TODO' | 'PROGRESS' | 'REVIEW' | 'DONE';
  createdAt: string;
}

export interface TaskEditCreation{
  id: string | null;
  noteId: string | null;
  title: string;
  description: string;
  urgencyTier: 'LIGHT' | 'MEDIUM' | 'IMPORTANT' | 'HEAVY' | 'IMPACTFUL';
  status: 'TODO' | 'PROGRESS' | 'REVIEW' | 'DONE';
}

export interface TaskEdit{
	title: string;
	description: string;
	urgencyTier: 'LIGHT' | 'MEDIUM' | 'IMPORTANT' | 'HEAVY' | 'IMPACTFUL';
	status: 'TODO' | 'PROGRESS' | 'REVIEW' | 'DONE';
}

export interface TaskCreation{
	noteId: string | null;
	title: string;
	description: string;
	urgencyTier: 'LIGHT' | 'MEDIUM' | 'IMPORTANT' | 'HEAVY' | 'IMPACTFUL';
	status: 'TODO' | 'PROGRESS' | 'REVIEW' | 'DONE';
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