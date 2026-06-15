import { Profile } from "@/app/types/dashboard.types";
import { isPlatformBrowser } from "@angular/common";
import { computed, inject, Injectable, PLATFORM_ID, signal } from "@angular/core";


@Injectable({
	providedIn: 'root'
})
export class ProfileStateService{
	private readonly platformId = inject(PLATFORM_ID);

	private readonly _activeProfile = signal<Profile | null>(this.loadProfileFromStorage());
	readonly activeProfile = this._activeProfile.asReadonly();
	readonly hasProfile = computed(() => this._activeProfile !== null);

	setActiveProfile(profile: Profile | null){
		this._activeProfile.set(profile);

		if (isPlatformBrowser(this.platformId)) {
			localStorage.setItem('activeProfile', JSON.stringify(profile));
		}
	}

	clearActiveProfile(): void {
		this._activeProfile.set(null);
		localStorage.removeItem('activeProfile');
	}

	private loadProfileFromStorage(): Profile | null {
		if (!isPlatformBrowser(this.platformId)) {
			return null; 
		}
		const profile = localStorage.getItem('activeProfile');
		return profile ? JSON.parse(profile) : null;
	}
}