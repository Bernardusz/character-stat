import { Component, input } from '@angular/core';
import { TaskSummary } from '@/app/types/dashboard.types';

@Component({
  selector: 'app-task-item',
  standalone: true,
  template: `
    <div class="flex items-center justify-between p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 rounded-lg transition group">
      <div class="flex items-center space-x-3">
        <div class="w-5 h-5 rounded border border-slate-500 flex items-center justify-center cursor-pointer hover:border-emerald-400 transition"
             [class.bg-emerald-500]="task().status === 'DONE'"
             [class.border-emerald-500]="task().status === 'DONE'">
          @if (task().status === 'DONE') {
            <span class="text-xs text-slate-900 font-bold">✓</span>
          }
        </div>
        
        <span class="text-slate-200 group-hover:text-white transition" 
              [class.line-through]="task().status === 'DONE'"
              [class.text-slate-500]="task().status === 'DONE'">
          {{ task().title }}
        </span>
      </div>

      <span class="text-xs px-2.5 py-1 rounded font-bold uppercase tracking-wide border"
            [class.bg-red-950]="task().urgencyTier === 'IMPACTFUL' || task().urgencyTier === 'HEAVY'"
            [class.text-red-400]="task().urgencyTier === 'IMPACTFUL' || task().urgencyTier === 'HEAVY'"
            [class.border-red-900]="task().urgencyTier === 'IMPACTFUL' || task().urgencyTier === 'HEAVY'"
            [class.bg-amber-950]="task().urgencyTier === 'IMPORTANT' || task().urgencyTier === 'MEDIUM'"
            [class.text-amber-400]="task().urgencyTier === 'IMPORTANT' || task().urgencyTier === 'MEDIUM'"
            [class.border-amber-900]="task().urgencyTier === 'IMPORTANT' || task().urgencyTier === 'MEDIUM'"
            [class.bg-slate-800]="task().urgencyTier === 'LIGHT'"
            [class.text-slate-400]="task().urgencyTier === 'LIGHT'"
            [class.border-slate-700]="task().urgencyTier === 'LIGHT'">
        {{ task().urgencyTier }}
      </span>
    </div>
  `
})
export class TaskItemComponent {
  task = input.required<TaskSummary>();
}