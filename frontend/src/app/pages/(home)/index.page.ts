import StatCard from '@/app/components/stat-card.component';
import { TaskItemComponent } from '@/app/components/task-item.component';
import IndexService from '@/app/pages/(home)/index.service';
import { ProfileStateService } from '@/app/shared/data-access/profile-state.service';
import { profileGuard } from '@/app/shared/guards/profile.guard';
import { DashboardData } from '@/app/types/dashboard.types';
import { RouteMeta } from '@analogjs/router';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { filter} from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const routeMeta: RouteMeta = {
	canActivate: [profileGuard],
	runGuardsAndResolvers: 'always'
}

@Component({
  selector: 'app-home',
  standalone: true,	
  templateUrl: "index.page.html",
  imports: [StatCard, TaskItemComponent, RouterLink]
})
export default class Home implements OnInit {
	private readonly indexService = inject(IndexService);
	protected readonly profileState = inject(ProfileStateService);
	private readonly router = inject(Router);
	private readonly destroyRef = inject(DestroyRef);

	dashboard = signal<DashboardData | null>(null);
	isLoading = signal(true);


	ngOnInit(): void {
		this.loadDashboardTelemetry();
	}

	private loadDashboardTelemetry(): void {
        const activeProfile = this.profileState.activeProfile();

        if (!activeProfile || !activeProfile.id) {
            this.isLoading.set(false);
            return;
        }

        this.isLoading.set(true);
        this.indexService.getDashboardData().subscribe({
            next: data => {
                this.dashboard.set(data);
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Dashboard telemetry data sync dropped:', error);
                this.isLoading.set(false);
            }
        });
    }
}
