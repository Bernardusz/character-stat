import { ProfileService } from '@/app/pages/profiles/profiles.service';
import { ProfileStateService } from '@/app/shared/data-access/profile-state.service';
import { Profile } from '@/app/types/dashboard.types';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import FormProfileComponent from '@/app/components/form-profile.component';

@Component({
  selector: 'app-profiles',
  templateUrl: 'profiles.page.html',
  standalone: true,
  imports: [FormProfileComponent]
})
export default class ProfilesPage implements OnInit {
	private readonly profileService = inject(ProfileService);
	protected profileState = inject(ProfileStateService);
	private readonly router = inject(Router);

	isLoading = signal(true);
	existingProfiles = signal<Profile[]>([]);
	isCreationMode = signal(false);
	isEditingMode = signal(false);

	setIsCreationMode(): void{
		this.isCreationMode.set(false);
	}

	setIsEditingMode(): void{
		this.isCreationMode.set(false);
	}

	ngOnInit(): void {
		this.loadProfiles();
		this.isLoading.set(false);
	}

	getActiveProfiles() : Profile | null{
		return this.profileState.activeProfile();
	}

	loadProfiles(): void {
		this.profileService.getAllProfiles().subscribe({
			next: data => {
				this.existingProfiles.set(data);
				if (data.length === 0){
					this.isCreationMode.set(true);
				}
			}
		})
	}

	selectProfile(profile: Profile): void {
		this.profileState.setActiveProfile(profile);
		this.router.navigate(['/']);
	}

	navigateToDashboard(): void {
		this.router.navigate(['/']);
	}

	createNewProfile(newProfileName: string): void{
		if (!newProfileName.trim()) return;

		this.profileService.createProfileAndFetch(newProfileName).subscribe({
			next: (createdProfile) => {
				this.profileState.setActiveProfile(createdProfile);
				this.router.navigate(['/']);
			},
			error: (err) => {
				console.error('Failed to create and verify new profile character:', err);
			},
		})
	}

	editProfile(newProfileName: string): void{
		if (!newProfileName.trim()) return;
		this.profileService.editProfileAndFetch(newProfileName).subscribe({
			next: (editedProfile) => {
				this.profileState.setActiveProfile(editedProfile);
				this.router.navigate(['/']);
			},
			error: (err) => {
				console.error('Failed to create and verify new profile character:', err);
			},
		});
	}

	deleteProfile(id: number): void {
		this.profileService.deleteProfile(id).subscribe({
			next: () => {
				this.profileState.clearActiveProfile();
				this.loadProfiles();
			}
		})
	}

}
