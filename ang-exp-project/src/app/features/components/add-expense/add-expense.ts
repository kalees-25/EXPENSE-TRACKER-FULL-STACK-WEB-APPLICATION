import { CommonModule } from '@angular/common';

import { Component, inject } from '@angular/core';

import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';

import { Router } from '@angular/router';

import { Expense } from '../../../models/expense.model';

import { ExpenseService } from '../../expenses/services/expense-service';

import { ExpenseDataService } from '../../expenses/services/expense-data.service';

// ------------------ SweetAlert2 Service  ------------------
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-add-expense',

  standalone: true,

  imports: [CommonModule, ReactiveFormsModule],

  templateUrl: './add-expense.html',

  styleUrls: ['./add-expense.css'],
})


export class AddExpenseComponent {
  
  private readonly fb = inject(NonNullableFormBuilder);

  private readonly expenseService = inject(ExpenseService);

  private readonly router = inject(Router);

  private readonly expenseDataService = inject(ExpenseDataService);

  // ------------------ INJECT SweetAlert2 Service  ------------------
  private readonly alertService = inject(AlertService);

  readonly loading$ = this.expenseDataService.loading$;

  errorMsg = '';

  readonly form = this.fb.group({
    date: ['', [Validators.required]],

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

    const formData = this.form.getRawValue();

    const payload = formData as Expense;

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
