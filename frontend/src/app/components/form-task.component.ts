import { ProfileStateService } from "@/app/shared/data-access/profile-state.service";
import { Note, NoteCreationEdit, Task, TaskEditCreation } from "@/app/types/dashboard.types";
import { Component, computed, inject, input, output, signal } from "@angular/core";
import { Router, RouterLink, ɵEmptyOutletComponent } from "@angular/router";

@Component({
	standalone: true,
	selector: 'form-task',
	template: `
		<form
			#noteForm
			class="flex flex-col gap-4 border-primary border p-4 rounded-2xl w-full h-fit"
			(submit)="handleSubmit($event)"
		>
			<h2>{{ text() }}</h2>
			<div class="flex flex-col w-full gap-2">
				<label for="title">Title</label>
				<input type="text" [value]="data()?.title ?? ''" name="title" placeholder="Input the title..." />

				<label for="description">Content</label>
				<textarea [value]="data()?.description ?? ''" name="description" placeholder="Input the decription..."></textarea>
			</div>

			<div class="flex flex-col w-full gap-2 text-foreground">
				<label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Urgency of this task</label>
				<select #categorySelect class="w-full rounded-xl p-3 text-sm focus:outline-none" [value]="data()?.urgencyTier ?? 'LIGHT'" name="urgency">
					<option value="LIGHT">💼 LIGHT</option>
					<option value="MEDIUM">📚 MEDIUM</option>
					<option value="IMPORTANT">🧠 IMPORTANT</option>
					<option value="HEAVY">🧙‍♂️ HEAVY</option>
					<option value="IMPACTFUL">🐧 IMPACTFUL</option>
				</select>
			</div>

          <button type="submit" [disabled]="isLoading()" (click)="isLoading.set(true)"
                  class="btn-primary p-2 bg-primary text-background rounded-2xl">
            {{ isLoading() ? 'Generating Note Container...' : 'Instantiate Workspace' }}
          </button>
		</form>
	`
})
export default class FormTaskComponent {
	private profileState = inject(ProfileStateService);
	method = input.required<'POST' | 'PUT'>();

	id = input<string>();
	data = input<TaskEditCreation>();
	text = input.required<string>();
	note_id = input<string>();

	task = output<TaskEditCreation>();


	isLoading = signal(false);

	async handleSubmit(event: Event) {
		event.preventDefault();

		const form = event.target as HTMLFormElement;
        
		const formData = new FormData(form);
		
		const title = formData.get('title') as TaskEditCreation['title'];
		const description = formData.get('description') as TaskEditCreation['description'];
		const urgency = formData.get('urgency') as TaskEditCreation['urgencyTier'];
		const id = this.id()?.toString();
		const noteId = computed(() => this.note_id());
		const status = computed(() => this.data()?.status ?? "TODO");

		try {
			this.task.emit({
				id: id ?? "", title, description, urgencyTier: urgency, noteId: noteId() ?? "", status: status() 
			});
        } catch (error) {
            console.error('Failed to submit form:', error);
        }

	}
}