import { inject, Injectable, WritableSignal, signal } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Task, TaskCreation, TaskEdit, TaskEditCreation, TaskSummary } from '@/app/types/dashboard.types';
import { catchError, debounceTime, EMPTY, map, Observable, Subject, switchMap } from 'rxjs';
import { ProfileStateService } from '@/app/shared/data-access/profile-state.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private profileState = inject(ProfileStateService);
  
  private get apiUrl(): string {
    const profileId = this.profileState.activeProfile()?.id;
    if (!profileId) {
      console.warn('⚠️ Routing telemetry requested before Active Profile verification context initialization.');
    }
    return `http://localhost:8080/api/profiles/${profileId ?? '0'}/tasks`;
  }

  private statusUpdateStream = new Subject<{}>();


  /**
   * 📡 GET: Get a specific task
   */
  getTask(id: string, signal: WritableSignal<TaskSummary | true | null | Task>) {
	return this.http.get<Task>(`${this.apiUrl}/${id}`).subscribe({
		next: (task) => {
			signal.set(task);
		},
		error: (err) => console.error('Failed to lazy-load description:', err)
	});
  }

  createTask(task: TaskCreation) {
		const activeProfileId = this.profileState.activeProfile()?.id;
		
		if (!activeProfileId) {
			throw new Error('Cannot create workspace container: No active character loaded.');
		}

		return this.http.post<string>(this.apiUrl, task, {
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

	updateSingleTask(taskId: string, task: TaskEdit): Observable<Task> {
		return this.http.put<Task>(`${this.apiUrl}/${taskId}`, task).pipe(
			switchMap(() => {
				return this.http.get<Task>(`${this.apiUrl}/${taskId}`);
			})
		)
	}

  /**
   * ❌ DELETE: Remove a task
   */
  deleteTask(taskId: string) {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }
}
