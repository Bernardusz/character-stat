import { Task } from "@/app/types/dashboard.types";
import { Component, input } from "@angular/core";

@Component({
	selector: 'task-detail',
	standalone: true,
	template: `
		<div class="flex flex-col gap-4 border-primary border p-4 rounded-2xl">
			<h3>Title: {{ task().title }}</h3>
			<hr/>
			<div class="flex flex-col justify-between">
				<span>Related to: {{ task().noteTitle ?? "null" }}</span>
				<span>Urgency: {{ task().urgencyTier }}</span>
				<span>status: {{ task().status }}</span>
			</div>
			<p>{{ task().description }}</p>
		</div>
	`
})
export default class TaskDetail{
	task = input.required<Task>();
}