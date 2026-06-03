
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../features/components/features/auth/auth.service';

import { AlertService }from '../shared/services/alert.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-bar.html',
  styleUrls: ['./nav-bar.css'],
})
export class NavBarComponent {



     private readonly authService =inject(AuthService);

  private readonly alertService =
    inject(AlertService);

  private readonly router =
    inject(Router);

  onLogout(): void {

    this.authService.logout();

    this.alertService.toastSuccess(
      'Logged out successfully'
    );

    this.router.navigate(['/login']);

  }

}