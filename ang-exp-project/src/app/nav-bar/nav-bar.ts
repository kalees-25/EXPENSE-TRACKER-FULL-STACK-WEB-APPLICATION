import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../features/components/features/auth/auth.service';

import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './nav-bar.html',
  styleUrls: ['./nav-bar.css'],
})
export class NavBarComponent {
  private readonly authService = inject(AuthService);

  private readonly alertService = inject(AlertService);

  private readonly router = inject(Router);

  onLogout(): void {
    this.authService.logout();

    this.alertService.toastSuccess('Logged out successfully');

    this.router.navigate(['/login']);
  }
}
