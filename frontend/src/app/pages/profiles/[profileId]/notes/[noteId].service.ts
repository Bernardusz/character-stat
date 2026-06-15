import { ProfileStateService } from "@/app/shared/data-access/profile-state.service";
import { Note, NoteCreationEdit} from "@/app/types/dashboard.types";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable, switchMap } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export default class NoteService{
	private http = inject(HttpClient);
	private profileState = inject(ProfileStateService)
	private apiUrl = `http://localhost:8080/api/profiles/${this.profileState.activeProfile()?.id}/notes`

	fetchSpecificNote(noteId: string): Observable<Note> {
		return this.http.get<Note>(`${this.apiUrl}/${noteId}`);
	}

	// Inside your NoteService:
	createNote(note: NoteCreationEdit) {
		const activeProfileId = this.profileState.activeProfile()?.id;
		
		if (!activeProfileId) {
			throw new Error('Cannot create workspace container: No active character loaded.');
		}

		return this.http.post<string>(this.apiUrl, note, {
			observe: 'response',
		}).pipe(
			map((response: HttpResponse<string>) => {
				const locationUrl = response.headers.get('location');
				if (!locationUrl) {
					throw new Error('Spring Boot didn\'t return a location header')
				}

				const segments = locationUrl.split('/');
				const newNoteId = segments[segments.length - 1];
				
				return newNoteId;
			})
		);
	}

	editNote(noteId: string, note: NoteCreationEdit): Observable<Note> {
		return this.http.put<Note>(`${this.apiUrl}/${noteId}`, note).pipe(
			switchMap(() => {
				return this.http.get<Note>(`${this.apiUrl}/${noteId}`);
			})
		);
	}

	deleteNote(noteId: string): Observable<void>{
		return this.http.delete<void>(`${this.apiUrl}/${noteId}`);
	}

}