import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import AppHeader from '@/app/layout/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeader],
  template: `
	<app-header/>
  	<router-outlet />
  `,
})
export class App {}
