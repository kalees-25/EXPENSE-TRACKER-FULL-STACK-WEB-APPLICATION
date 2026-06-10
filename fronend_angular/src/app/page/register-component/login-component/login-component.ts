// login.component.ts

import { Component, inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';

import { Router, RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatButtonModule } from '@angular/material/button';

import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatIconModule } from '@angular/material/icon';

import { finalize } from 'rxjs';

import { AuthService } from '../../../features/components/features/auth/auth.service';

import { LoginRequest, LoginFormModel, AuthResponse } from '../../../models/auth.model';

// ----------------------SWEET ALERT----------------------

import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    ReactiveFormsModule,

    MatFormFieldModule,

    MatInputModule,

    MatButtonModule,

    MatCheckboxModule,

    MatIconModule,

    RouterLink,
  ],

  templateUrl: './login-component.html',

  styleUrls: ['./login-component.css'],
})
export class LoginComponent implements AfterViewInit {
  // ---------------------------------------------------
  // FORM BUILDER
  // ---------------------------------------------------

  private fb = inject(NonNullableFormBuilder);

  private alertService = inject(AlertService);

  @ViewChild('emailInput') emailInput?: ElementRef;

  hidePassword = true;

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }
  // ---------------------------------------------------
  // UI STATE
  // ---------------------------------------------------

  loading = false;

  errorMsg = '';

  // ---------------------------------------------------
  // LOGIN FORM
  // ---------------------------------------------------

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],

    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // ---------------------------------------------------
  // DEPENDENCY INJECTION
  // ---------------------------------------------------

  constructor(
    private authService: AuthService,

    private router: Router,
  ) {}

  // ---------------------------------------------------
  // LIFECYCLE - AUTO FOCUS EMAIL
  // ---------------------------------------------------

  ngAfterViewInit(): void {
    // Auto-focus email input for better UX
    setTimeout(() => {
      this.emailInput?.nativeElement?.focus();
    }, 300);
  }

  // ---------------------------------------------------
  // LOGIN SUBMIT
  // ---------------------------------------------------

  onSubmit(): void {
    console.log('LOGIN BUTTON CLICKED');

    console.log(this.loginForm.valid);

    console.log(this.loginForm.value);

    // -----------------------------
    // INVALID FORM
    // -----------------------------

    if (this.loginForm.invalid) {
      console.log('FORM INVALID');

      this.loginForm.markAllAsTouched();

      return;
    }
    console.log('FORM VALID');

    // -----------------------------
    // START LOADING
    // -----------------------------

    this.loading = true;

    this.errorMsg = '';

    // -----------------------------
    // CLEAN PAYLOAD
    // -----------------------------

    const payload: LoginRequest = this.loginForm.getRawValue();

    // -----------------------------
    // LOGIN API CALL
    // -----------------------------

    this.authService

      .login(payload)

      .pipe(
        finalize(() => {
          // -----------------------------
          // STOP LOADING
          // -----------------------------

          this.loading = false;
        }),
      )

      .subscribe({
        // -----------------------------
        // LOGIN SUCCESS
        // -----------------------------

        next: (response: AuthResponse) => {
          // -----------------------------
          // REDIRECT USER
          // -----------------------------

          this.alertService.toastSuccess('Login successful');

          this.router.navigate(['/dashboard']);
        },

        // -----------------------------
        // LOGIN FAILED
        // -----------------------------

        error: (error: HttpErrorResponse) => {
          this.errorMsg = this.getErrorMessage(error);
        },
      });
  }

  // ---------------------------------------------------
  // ERROR HANDLING
  // ---------------------------------------------------

  private getErrorMessage(error: HttpErrorResponse): string {
    // -----------------------------
    // FASTAPI DETAIL
    // -----------------------------

    if (error?.error?.detail) {
      return error.error.detail;
    }

    // -----------------------------
    // CUSTOM MESSAGE
    // -----------------------------

    if (error?.error?.message) {
      return error.error.message;
    }

    // -----------------------------
    // SERVER OFFLINE
    // -----------------------------

    if (error.status === 0) {
      return 'Server unreachable';
    }

    // -----------------------------
    // UNAUTHORIZED
    // -----------------------------

    if (error.status === 401) {
      return 'Invalid email or password';
    }

    // -----------------------------
    // SERVER ERROR
    // -----------------------------

    if (error.status >= 500) {
      return 'Internal server error';
    }

    // -----------------------------
    // DEFAULT ERROR
    // -----------------------------

    return 'Login failed';
  }

  // ---------------------------------------------------
  // FORM FIELD ERROR CHECK
  // ---------------------------------------------------

  hasError(
    controlName: keyof LoginFormModel,

    errorName: string,
  ): boolean {
    const control = this.loginForm.get(controlName);

    return !!(control?.touched && control.hasError(errorName));
  }

  // ---------------------------------------------------
  // CLEAN TEMPLATE ACCESS
  // ---------------------------------------------------

  get f() {
    return this.loginForm.controls;
  }
}
