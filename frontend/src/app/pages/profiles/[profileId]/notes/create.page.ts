import FormNoteComponent from "@/app/components/form-note.component";
import NoteService from "@/app/pages/profiles/[profileId]/notes/[noteId].service";
import { ProfileStateService } from "@/app/shared/data-access/profile-state.service";
import { profileGuard } from "@/app/shared/guards/profile.guard";
import { NoteCreationEdit } from "@/app/types/dashboard.types";
import { RouteMeta } from "@analogjs/router";
import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";

export const routeMeta: RouteMeta = {
	canActivate: [profileGuard],
}
@Component({
	standalone: true,
	selector: 'note-creation-page',
	imports: [FormNoteComponent, RouterLink],
	template: `
		<section class="section">
			<a routerLink="/" class="absolute top-0 text-background justify-center items-center text-center left-4 btn-primary bg-primary p-2 rounded-2xl">Go Back</a>
			<form-note
				method="POST"
				text="Create a new workspace container"
				(task)="createNote($event)"
			>
			</form-note>
		</section>
	`
})
export default class NoteCreationPage{
	private noteService = inject(NoteService);
	private router = inject(Router);
	protected profileState = inject(ProfileStateService);

	createNote(note: NoteCreationEdit) {
		this.noteService.createNote(note).subscribe({
			next: (noteId) => {
				this.router.navigate(['/profiles', this.profileState.activeProfile()?.id, 'notes', noteId])
			},
			error: (err) => {
				console.error('Failed to create and verify new profile character:', err);
			}
		})
	}
}