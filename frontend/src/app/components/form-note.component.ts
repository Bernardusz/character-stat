import { ProfileStateService } from "@/app/shared/data-access/profile-state.service";
import { Note, NoteCreationEdit } from "@/app/types/dashboard.types";
import { Component, computed, inject, input, output, signal } from "@angular/core";
import { Router, RouterLink, ɵEmptyOutletComponent } from "@angular/router";

@Component({
	standalone: true,
	selector: 'form-note',
	template: `
		<form
			#noteForm
			class="flex flex-col gap-4 border-primary border p-4 rounded-2xl w-full h-fit"
			(submit)="handleSubmit($event)"
		>
			<h2>{{ text() }}</h2>
			<div class="flex flex-col w-full gap-2">
				<label for="title">Title</label>
				<input type="text" [value]="data()?.noteSummary?.title ?? ''" name="title" placeholder="Input the title..." />

				<label for="content">Content</label>
				<textarea [value]="data()?.content ?? ''" name="content" placeholder="Input the content..."></textarea>
			</div>

			<div>
				<label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Workspace Category</label>
				<select #categorySelect class="w-full rounded-xl p-3 text-sm focus:outline-none" [value]="data()?.noteSummary?.category ?? 'PROJECT'" name="category">
					<option value="PROJECT">💼 Project</option>
					<option value="LEARNING">📚 Learning</option>
					<option value="BRAINDUMP">🧠 Brain Dump</option>
					<option value="HOBBY">🧙‍♂️ Personal Quests</option>
				</select>
			</div>

          <button type="submit" [disabled]="isLoading()" (click)="isLoading.set(true)"
                  class="btn-primary p-2 bg-primary text-background rounded-2xl">
            {{ isLoading() ? 'Generating Note Container...' : 'Instantiate Workspace' }}
          </button>
		</form>
	`
})
export default class FormNoteComponent {
	private profileState = inject(ProfileStateService);
	method = input.required<'POST' | 'PUT'>();

	user_id = computed(() => this.profileState.activeProfile()?.id)
	id = input<string>();
	data = input<Note>();

	task = output<NoteCreationEdit>();

	text = input.required<string>();

	isLoading = signal(false);

	async handleSubmit(event: Event) {
		event.preventDefault();

		const form = event.target as HTMLFormElement;
        
		const formData = new FormData(form);
		
		const title = formData.get('title') as NoteCreationEdit['title'];
		const content = formData.get('content') as NoteCreationEdit['content'];
		const category = formData.get('category') as NoteCreationEdit['category'];
		const id = this.id()?.toString();

		try {
			this.task.emit({
				id: id ?? "", title, content, category
			});
        } catch (error) {
            console.error('Failed to submit form:', error);
        }

	}
}