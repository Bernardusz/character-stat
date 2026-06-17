import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { TaskSummary } from '@/app/types/dashboard.types';
import { ProfileStateService } from '@/app/shared/data-access/profile-state.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [RouterLink],
  template: `
    
        <div class="flex items-center justify-between p-4 bg-background text-foreground border border-primary rounded-lg transition group hover:scale-105">
            <div class="flex items-center space-x-3 w-full">
                <div class="flex items-center justify-between w-full">
					<a [routerLink]="urlLink()">
						<h3 [class.line-through]="task().status === 'DONE'"
							[class.text-slate-500]="task().status === 'DONE'">
							{{ task().title }}
						</h3>	
					</a>
                    <button (click)="deleteTask.emit(task().id)" 
                            class="px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 active:bg-red-700 transition">
                        Delete
                    </button>
                </div>  
            </div>

            <span class="text-xs px-2.5 py-1 rounded font-bold uppercase tracking-wide border whitespace-nowrap ml-4"
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
export class TaskItemComponent implements OnInit {
  private profileState = inject(ProfileStateService);
  
  task = input.required<TaskSummary>();
  deleteTask = output<string>(); // 💡 Note: If task IDs are numeric in your database, pass number instead of string
  urlLink = signal<string | null>(null);

  ngOnInit(): void {
	this.urlLink.set(
	    `/profiles/${this.profileState.activeProfile()?.id}/tasks/${this.task().id}`
	)
  }
}