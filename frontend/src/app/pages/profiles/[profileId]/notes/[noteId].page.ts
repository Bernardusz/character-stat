import FormNoteComponent from "@/app/components/form-note.component";
import { TaskItemComponent } from "@/app/components/task-item.component";
import NoteService from "@/app/pages/profiles/[profileId]/notes/[noteId].service";
import { ProfileStateService } from "@/app/shared/data-access/profile-state.service";
import { profileGuard } from "@/app/shared/guards/profile.guard";
import { Note, NoteCreationEdit } from "@/app/types/dashboard.types";
import { RouteMeta } from "@analogjs/router";
import { Component, inject, Input, OnInit, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";

export const routeMeta: RouteMeta = {
	canActivate: [profileGuard],
}

@Component({
	standalone: true,
	selector: 'app-note',
	imports: [TaskItemComponent, RouterLink, FormNoteComponent],
	templateUrl: '[noteId].page.html'
})
export default class NoteIdPage implements OnInit{
	protected profileState = inject(ProfileStateService);
	private noteService = inject(NoteService);
	private router = inject(Router);
	
	@Input() noteId!: string;
	note = signal<Note | null>(null);

	isLoading = signal(true);
	isEditing = signal(false);

	ngOnInit(): void {
		this.getNote(this.noteId);
		this.isLoading.set(false);
	}

	getNote(id: string){
		this.noteService.fetchSpecificNote(id).subscribe({
			next: (note) => {
				this.note.set(note);
			},
			error: (error) => {
				console.error('Note data sync dropped:', error);
			}
		})
	}

	editNote(note: NoteCreationEdit){
		const cleanNoteId = note.id ?? this.note()?.noteSummary.id;
    
		if (!cleanNoteId) {
			console.error(' Aborting network write: Note ID metrics are missing.');
			return;
		}
		const payload: NoteCreationEdit = {
			id: cleanNoteId,
			title: note.title?.trim() || "Untitled Workspace",
			content: note.content?.trim() || "",
			category: note.category || "PROJECT"
		};
		this.noteService.editNote(note.id ?? "", payload).subscribe({
			next: (note) => {
				this.note.set(note);
				this.isEditing.set(false)
			},
			error: (error) => {
				console.error('Note data sync dropped:', error);
			}
		})
	}

	deleteNote(id: string){
		this.noteService.deleteNote(id).subscribe({
			next: () => {
				this.note.set(null);
				this.router.navigate(['/'])
			},
			error: (error) => {
				console.error('Note data sync dropped:', error);
			}
		})
	}
}