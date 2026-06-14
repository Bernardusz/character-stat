import { ProfileStateService } from "@/app/shared/data-access/profile-state.service";
import { Component, computed, inject } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
	standalone: true,
	selector: 'app-header',
	imports: [RouterLink],
	template: ` 
	<header class="z-40 flex flex-row justify-between align-middle p-8 text-primary">
		<a routerLink="/">
			<h1>Character Stat</h1>
		</a>

		@if( username !== undefined){
			<a routerLink="/profiles">
				<h3>
					{{ username() }}
				</h3>
			</a>
		}
	</header>
	`
})
export default class AppHeader{
	private readonly profileState = inject(ProfileStateService);

	username = computed(() => this.profileState.activeProfile()?.username);
}