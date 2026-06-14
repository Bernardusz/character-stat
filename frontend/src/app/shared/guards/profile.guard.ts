import { ProfileStateService } from "@/app/shared/data-access/profile-state.service";
import { CanActivateFn, Router } from "@angular/router";
import { inject} from "@angular/core";

export const profileGuard: CanActivateFn = () => {
	const profileState = inject(ProfileStateService);
	const router = inject(Router);

	if (profileState.hasProfile()) {
		return true;
	}
	return router.parseUrl('/profiles');
}