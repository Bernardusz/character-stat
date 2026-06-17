import FormTaskComponent from "@/app/components/form-task.component";
import { TaskService } from "@/app/pages/profiles/[profileId]/tasks/[taskId].service";
import { ProfileStateService } from "@/app/shared/data-access/profile-state.service";
import { TaskCreation, TaskEditCreation } from "@/app/types/dashboard.types";
import { Component, inject, Input, input } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

@Component({
	standalone: true,
	imports: [FormTaskComponent, RouterLink],
	template: `
	<section class="section">
		<a routerLink="/" class="absolute top-0 text-background justify-center items-center text-center left-4 btn-primary bg-primary p-2 rounded-2xl">Go Back</a>
		<form-task
			method="POST"
			text="Create a new workspace container"
			(task)="createNote($event)"
		>
		</form-task>
	</section>
	`
})
export default class CreateTaskPage {
	private taskService = inject(TaskService)
	private router = inject(Router);
	private profileState = inject(ProfileStateService);
	private route = inject(ActivatedRoute);

	@Input() noteId?: string

	createNote(note: TaskEditCreation){
		const payload: TaskCreation = {
			noteId: this.noteId ?? null,
			title: note.title?.trim() || "Untitled Workspace",
			description: note.description?.trim() || "",
			urgencyTier: note.urgencyTier || "LIGHT",
			status: note.status || "TODO"
		}

		this.taskService.createTask(payload).subscribe({
			next: taskId => {
				this.router.navigate(['/profiles', this.profileState.activeProfile()?.id, 'tasks', taskId])
			}
		});
	}
}