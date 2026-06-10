import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

import { Expense } from '../../../models/expense.model';
import { ExpenseService } from '../../expenses/services/expense-service';
import { ExpenseDataService } from '../../expenses/services/expense-data.service';
import { AuthService } from '../features/auth/auth.service';
import { AlertService } from '../../../shared/services/alert.service';

// Angular Material
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-edit-expense',
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
    MatCardModule,
  ],
  templateUrl: './edit-expense.html',
  styleUrls: ['./edit-expense.css'],
})
export class EditExpenseComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly expenseService = inject(ExpenseService);
  private readonly expenseDataService = inject(ExpenseDataService);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentUser$ = this.authService.currentUser$;
  readonly loading$ = this.expenseDataService.loading$;

  // Component state
  readonly isLoading = signal(true);
  readonly notFound = signal(false);
  readonly isSaving = signal(false);

  errorMsg = '';
  private expenseId = 0;

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

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (params) => {
        const id = Number(params.get('id'));
        if (!id) {
          this.router.navigate(['/expenses']);
          return;
        }
        this.expenseId = id;
        this.loadExpense();
      },
    });
  }

  private loadExpense(): void {
    this.isLoading.set(true);
    this.notFound.set(false);

    this.expenseService.fetchExpenseById(this.expenseId).subscribe({
      next: (expense) => {
        this.populateForm(expense);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notFound.set(true);
      },
    });
  }

  private populateForm(expense: Expense): void {
    this.form.patchValue({
      date: expense.date ? new Date(expense.date) : null,
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMsg = '';
    this.isSaving.set(true);

    const raw = this.form.getRawValue();
    const updatedExpense: Expense = {
      id: this.expenseId,
      date: raw.date ? (raw.date as Date).toISOString().split('T')[0] : '',
      category: raw.category,
      description: raw.description,
      amount: raw.amount,
    };

    this.expenseService.updateExpense(updatedExpense).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.alertService.success('Updated', 'Expense updated successfully');
        this.expenseService.loadExpenses();
        this.router.navigate(['/expenses']);
      },
      error: (error: HttpErrorResponse) => {
        this.isSaving.set(false);
        this.errorMsg = this.getErrorMessage(error);
        this.alertService.error('Error', 'Could not update expense');
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
    if (error.status === 0) {
      return 'Server unreachable';
    }
    if (error.status >= 500) {
      return 'Internal server error';
    }
    return 'Failed to update expense';
  }
}
