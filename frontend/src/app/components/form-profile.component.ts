import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, inject, input, output } from "@angular/core";
import { Router } from "@angular/router";

@Component({
	standalone: true,
	selector: 'form-profile',
	template: `
		<form
			#profileForm
			class="flex flex-col gap-4 border-primary border p-4 rounded-2xl"
			(submit)="handleSubmit($event)"
		>
			<h2>{{ text() }}</h2>
			<div>
				<label for="username">Username</label>
				<input type="text" [value]="username() ?? ''" placeholder="Input the username..." name="username" />
			</div>

			<button class="button" type="submit">Submit</button>
		</form>
	`
})
export default class FormProfileComponent {
	private readonly router = inject(Router);

	method = input.required<'POST' | 'PUT'>();
	username = input<string>();
	task = output<string>();
	id = input<number>();
	text = input.required<string>();

	async handleSubmit(event: Event) {
		event.preventDefault();

		const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
		const newUsername = formData.get('username') as string;

		try {
			this.task.emit(newUsername);
        } catch (error) {
            console.error('Failed to submit form:', error);
        }

	}
}