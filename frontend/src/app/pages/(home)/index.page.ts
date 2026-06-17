import StatCard from '@/app/components/stat-card.component';
import TaskContainer from '@/app/components/task-container.component';
import { TaskItemComponent } from '@/app/components/task-item.component';
import IndexService from '@/app/pages/(home)/index.service';
import { TaskService } from '@/app/pages/profiles/[profileId]/tasks/[taskId].service';
import { ProfileStateService } from '@/app/shared/data-access/profile-state.service';
import { profileGuard } from '@/app/shared/guards/profile.guard';
import { DashboardData, Task, TaskSummary } from '@/app/types/dashboard.types';
import { RouteMeta } from '@analogjs/router';
import { CdkDragDrop, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

export const routeMeta: RouteMeta = {
	canActivate: [profileGuard],
	runGuardsAndResolvers: 'always'
}

@Component({
  selector: 'app-home',
  standalone: true,	
  templateUrl: "index.page.html",
  imports: [StatCard, TaskItemComponent, RouterLink, TaskContainer, CdkDropListGroup]
})
export default class Home implements OnInit {
	private readonly indexService = inject(IndexService);
	protected readonly profileState = inject(ProfileStateService);

	dashboard = signal<DashboardData | null>(null);
	isLoading = signal(true);

	todoTasks  = computed(() => this.indexService.localTasks()?.filter(task => task.status === 'TODO'));
	progressTasks  = computed(() => this.indexService.localTasks()?.filter(task => task.status === 'PROGRESS'));
	reviewTasks  = computed(() => this.indexService.localTasks()?.filter(task => task.status === 'REVIEW'));
	doneTasks  = computed(() => this.indexService.localTasks()?.filter(task => task.status === 'DONE'));


	ngOnInit(): void {
		this.loadDashboardTelemetry();
		this.isLoading.set(false);
	}

	onCardDropped(event: CdkDragDrop<any[]>) {
		const movedTask = event.previousContainer.data[event.previousIndex];
		const targetStatus = event.container.id as Task['status'];

		if (!movedTask) return;

		this.indexService.updateTask(
			movedTask.id, targetStatus, event.previousIndex, event.currentIndex, event.previousContainer.id === event.container.id
		)
	}

	deleteTask(taskId: string){
		this.indexService.deleteTask(taskId);
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
            },
            error: (error) => {
                console.error('Dashboard telemetry data sync dropped:', error);
                this.isLoading.set(false);
            }
        });

		this.indexService.getAllTasks().subscribe({
			next: tasks => {
				this.indexService.initializeData(tasks);
			},
			error: err => {
				console.error('Failed to lazy-load tasks:', err);
			}
		})
    }
}
