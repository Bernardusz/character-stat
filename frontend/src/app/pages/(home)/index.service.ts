import { ProfileStateService } from "@/app/shared/data-access/profile-state.service";
import { DashboardData } from "@/app/types/dashboard.types";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
	providedIn: 'root'
})
export default class IndexService {
	private http = inject(HttpClient);
	private profileState = inject(ProfileStateService);
	private apiUrl = `http://localhost:8080/api/profiles/${this.profileState.activeProfile()?.id}`

	getDashboardData(): Observable<DashboardData>{
		return this.http.get<DashboardData>(this.apiUrl + '/dashboard');
	}
}