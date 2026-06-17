import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { TaskService } from '@/app/pages/profiles/[profileId]/tasks/[taskId].service';
import { Task, TaskEdit, TaskEditCreation } from '@/app/types/dashboard.types';
import FormTaskComponent from '@/app/components/form-task.component';
import TaskDetail from '@/app/components/task-detail.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormTaskComponent, TaskDetail],
  templateUrl: '[taskId].page.html',
})
export default class TaskPage implements OnInit {
	private taskService = inject(TaskService);
	private router = inject(Router);
	@Input() taskId!: string

	task = signal<Task | null>(null);
	isEditing = signal(false);
	isLoading = signal(true);

	ngOnInit(): void {
		this.taskService.getTask(this.taskId, this.task);
		this.isLoading.set(false);
	}

	triggerDeleteTask(taskId: string){
		this.taskService.deleteTask(taskId);
	}

	toggleEdit(): void {
		this.isEditing.set(!this.isEditing());
	}

	editNote(task: TaskEditCreation){
		const cleanTaskId = task.id ?? this.task()?.id;
	
		if (!cleanTaskId) {
			console.error(' Aborting network write: Note ID metrics are missing.');
			return;
		}
		const payload: TaskEdit = {
			title: task.title?.trim() || "Untitled Workspace",
			description: task.description?.trim() || "",
			urgencyTier: task.urgencyTier || "LIGHT",
			status: task.status || "TODO"
		};
		this.taskService.updateSingleTask(task.id ?? "", payload).subscribe({
			next: (note) => {
				this.task.set(note);
				this.isEditing.set(false)
			},
			error: (error) => {
				console.error('Note data sync dropped:', error);
			}
		})
	}

	deleteTask(id: string){
		this.taskService.deleteTask(id).subscribe({
			next: () => {
				this.router.navigate(['/']);
			},
			error: error => {
				console.error('Note data sync dropped:', error);
			}
		});
	}
}
