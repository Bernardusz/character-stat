import { StatBarsComponent } from '@/app/components/stat-bars.component';
import { TaskItemComponent } from '@/app/components/task-item.component';
import IndexService from '@/app/pages/(home)/index.service';
import { ProfileStateService } from '@/app/shared/data-access/profile-state.service';
import { profileGuard } from '@/app/shared/guards/profile.guard';
import { DashboardData } from '@/app/types/dashboard.types';
import { RouteMeta } from '@analogjs/router';
import { Component, inject, OnInit, signal } from '@angular/core';


export const routeMeta: RouteMeta = {
	canActivate: [profileGuard],
}

@Component({
  selector: 'app-home',
  standalone: true,	
  templateUrl: "index.page.html",
  imports: [StatBarsComponent, TaskItemComponent]
})
export default class Home implements OnInit {
	private readonly indexService = inject(IndexService);
	private readonly profileState = inject(ProfileStateService);

	dashboard = signal<DashboardData | null>(null);
	isLoading = signal(true);


	ngOnInit(): void {
		const activeProfile = this.profileState.activeProfile();

		if(!activeProfile || !activeProfile.id){
			this.isLoading.set(false);
			return;
		}

		this.indexService.getDashboardData().subscribe({
			next: data => {
				this.dashboard.set(data);
				this.isLoading.set(false);
			},
			error: (error) => {
				console.error('Dashboard telemetry data sync dropped:', error);
        		this.isLoading.set(false);
			}
		})
	}
}
