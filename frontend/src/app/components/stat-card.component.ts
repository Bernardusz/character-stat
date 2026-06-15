import { Component, input } from "@angular/core";

@Component({
	standalone: true,
	selector: 'stat-card',
	template: `
	<div class="hover-transform border border-primary p-8 rounded-2xl">
        <div class="flex justify-between">
          <span>{{ text() }}</span>
          <span>{{ stat() }}/100</span>
        </div>
        <div class="w-full h-4 rounded-full overflow-hidden border ">
          <div class="border-primary h-full bg-linear-to-r from-primary via-white to-primary transition-all duration-500"
               [style.width.%]="stat()"></div>
        </div>
	</div>
	`,
})
export default class StatCard{
	stat = input.required<number>();
	text = input.required<string>();
}