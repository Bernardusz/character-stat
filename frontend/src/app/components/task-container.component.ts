import { TaskSummary } from "@/app/types/dashboard.types";
import { CdkDrag, CdkDropList, CdkDragDrop } from "@angular/cdk/drag-drop";
import { DatePipe } from "@angular/common";
import { Component, inject, input, output } from "@angular/core";
import { TaskItemComponent } from "./task-item.component";
import { RouterLink } from "@angular/router";
import { ProfileStateService } from "@/app/shared/data-access/profile-state.service";

@Component({
	selector: 'task-container',
	standalone: true,
	imports: [CdkDropList, CdkDrag, DatePipe, TaskItemComponent, RouterLink],
	host: {
        class: 'block h-full'
    },
	template: `
		<div class="flex flex-col gap-4">
			<h2 class="text-lg font-bold text-foreground">{{ title() }}</h2>
			<div
				cdkDropList
				[id]="id()"
				[cdkDropListData]="tasks()"
				(cdkDropListDropped)="dropped.emit($any($event))"
				class="rounded-2xl flex flex-col gap-2 p-2 h-full"
			>
				@for (task of tasks(); track task.id) {
					<app-task-item
						cdkDrag [id]="task.id"
						[task]="{
							id: task.id,
							noteId: task.noteId,
							noteTitle: task.noteTitle,
							title: task.title,
							position: task.position,
							urgencyTier: task.urgencyTier,
							status: task.status,
							createdAt: (task.createdAt | date:'dd-MM-yyyy') ?? '',
						}"
							(deleteTask)="deleteTask.emit($event)"
					/>
				}
				@empty {
					<p class="p-deemphasize">No tasks to do</p>
				}
				@if (isAddTaskAllowed()) {
					<a class="bg-primary rounded-xl text-background text-center" [routerLink]="urlTaskCreation">
						Add Task +
					</a>	
				}
			</div>
		</div>
	`
})
export default class TaskContainer {
	private readonly profileState = inject(ProfileStateService);
	id = input.required<string>();
	title = input.required<string>();
	tasks = input.required<TaskSummary[]>();
	isAddTaskAllowed = input<boolean>();
	dropped = output<CdkDragDrop<TaskSummary[]>>();
	deleteTask = output<string>();

	urlTaskCreation = 'profiles/' + this.profileState.activeProfile()?.id + '/tasks/create';
}