import { ProfileStateService } from "@/app/shared/data-access/profile-state.service";
import { Profile } from "@/app/types/dashboard.types";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Observable, switchMap } from "rxjs";


@Injectable({
	providedIn: 'root'
})
export class ProfileService {
	private http = inject(HttpClient);
	private profileState = inject(ProfileStateService);
	private apiUrl = `http://localhost:8080/api/profiles`;

	getAllProfiles(): Observable<Profile[]> {
		return this.http.get<Profile[]>(this.apiUrl);
	}

  	// ✅ Same rule for creation: Return the stream directly!
	createProfileAndFetch(username: string ){
		return this.http.post<Profile>(this.apiUrl, { username }, {
			observe: 'response',
		}).pipe(
			switchMap((response: HttpResponse<Profile>) => {
				const locationUrl = response.headers.get('location');

				console.log('Inspecting intercepted location header string:', locationUrl);
				if (!locationUrl){
					throw new Error('Spring Boot didn\'t return a location header')
				}

				return this.http.get<Profile>(locationUrl);
			})
		);
	}

	editProfileAndFetch(username: string ): Observable<Profile>{
		const activeId = this.profileState.activeProfile()?.id;

		if (!activeId) {
			throw new Error('Cannot update profile: No active profile session located.');
		}

		return this.http.put<Profile>(`${this.apiUrl}/${activeId}`, { username }).pipe(
			switchMap(() => {
				return this.http.get<Profile>(`${this.apiUrl}/${activeId}`);
			})
		);
	}

	deleteProfile(id: number): Observable<void> {
		return this.http.delete<void>(`${this.apiUrl}/${id}`);
	}
}