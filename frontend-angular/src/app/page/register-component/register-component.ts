import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../features/components/features/auth/auth.service';
import { RegisterRequest, RegisterFormModel } from '../../models/auth.model';
import { matchFieldsValidator } from '../../validators/password-match.validator';

import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './register-component.html',
  styleUrls: ['./register-component.css'],
})
export class RegisterComponent {
  private fb = inject(NonNullableFormBuilder);

  loading = false;
  errorMsg = '';
  hidePassword = true;
  hideConfirmPassword = true;

  registerForm = this.fb.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],

      email: ['', [Validators.required, Validators.email]],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          ),
        ],
      ],

      confirmPassword: ['', [Validators.required]],
    },
    { validators: matchFieldsValidator('password', 'confirmPassword') },
  );

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    this.errorMsg = '';

    const { username, email, password } = this.registerForm.getRawValue();

    const payload: RegisterRequest = {
      username,
      email,
      password,
    };

    this.authService

      .register(payload)

      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMsg = this.getErrorMessage(error);
        },
      });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error?.error?.detail) {
      return error.error.detail;
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.status === 0) {
      return 'Server unreachable';
    }

    if (error?.status >= 500) {
      return 'Internal server error';
    }

    return 'Something went wrong';
  }

  // ----------------------Error handling IN FORM--------------------------
  hasError(controlName: keyof RegisterFormModel, errorName: string): boolean {
    const control = this.registerForm.get(controlName);

    return !!(control?.touched && control?.hasError(errorName));
  }

  get f() {
    return this.registerForm.controls;
  }
}
