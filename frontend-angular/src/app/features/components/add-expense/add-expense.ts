import { CommonModule } from '@angular/common';

import { Component, inject } from '@angular/core';

import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';

import { Router, RouterModule } from '@angular/router';

import { Expense } from '../../../models/expense.model';

import { ExpenseService } from '../../expenses/services/expense-service';

import { ExpenseDataService } from '../../expenses/services/expense-data.service';

import { AuthService } from '../features/auth/auth.service';

// -------------------------------------------------------------------
// --------------------ANGULAR MATERIAL  --------------------
// ----------------------------------------------------------------
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// -------------------------------------------------------------
// ------------------ SweetAlert2 Service  ---------------------
// -------------------------------------------------------------
import { AlertService } from '../../../shared/services/alert.service';

// ------------------ Angular Material  ------------------
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-expense',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
  ],

  templateUrl: './add-expense.html',

  styleUrls: ['./add-expense.css'],
})
export class AddExpenseComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  private readonly expenseService = inject(ExpenseService);

  private readonly router = inject(Router);

  private readonly expenseDataService = inject(ExpenseDataService);

  private readonly authService = inject(AuthService);

  // ------------------ INJECT SweetAlert2 Service  ------------------
  private readonly alertService = inject(AlertService);

  readonly currentUser$ = this.authService.currentUser$;

  readonly loading$ = this.expenseDataService.loading$;

  errorMsg = '';

  readonly categories = [
    { value: 'Food', label: 'Food', icon: 'restaurant' },
    { value: 'Travel', label: 'Travel', icon: 'flight' },
    { value: 'Shopping', label: 'Shopping', icon: 'shopping_cart' },
    { value: 'Bills', label: 'Bills', icon: 'receipt_long' },
    { value: 'Health', label: 'Health', icon: 'favorite' },
    { value: 'Entertainment', label: 'Entertainment', icon: 'movie' },
    { value: 'Rent', label: 'Rent', icon: 'home' },
    { value: 'Working', label: 'Working', icon: 'work' },
    { value: 'Loan', label: 'Loan', icon: 'account_balance' },
  ];

  readonly form = this.fb.group({
    date: this.fb.control<Date | null>(null, [Validators.required]),

    category: ['', [Validators.required]],

    description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],

    amount: [0, [Validators.required, Validators.min(1)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.errorMsg = '';

    const raw = this.form.getRawValue();

    const payload: Expense = {
      date: raw.date ? (raw.date as Date).toISOString().split('T')[0] : '',
      category: raw.category,
      description: raw.description,
      amount: raw.amount,
    } as Expense;

    this.expenseService

      .addExpense(payload)

      .subscribe({
        // --------------------------------------------------------------------
        // ----------SWEET ALERT------------
        // --------------------------------------------------------------------
        next: () => {
          this.alertService.success('Saved', 'Expense added successfully');

          this.router.navigate(['/expenses']);
        },

        error: (error: HttpErrorResponse) => {
          this.errorMsg = this.getErrorMessage(error);
          this.alertService.error('Error', 'Could not save expense');
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/expenses']);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error?.error?.detail) {
      return error.error.detail;
    }

    if (error?.status === 0) {
      return 'Server unreachable';
    }

    if (error?.status >= 500) {
      return 'Internal server error';
    }

    return 'Failed to add expense';
  }
}
