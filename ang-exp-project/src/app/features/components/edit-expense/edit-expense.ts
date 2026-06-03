import { CommonModule } from '@angular/common';

import { Component, OnInit, inject } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';

import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { Expense } from '../../../models/expense.model';

import { ExpenseService } from '../../expenses/services/expense-service';

import { ExpenseDataService } from '../../expenses/services/expense-data.service';

// ---------------------------------------------------------------
// ---------------IMPORT ALERT SERVICE----------------
// -------------------------------------------------------------

import { AlertService } from '../../../shared/services/alert.service';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DestroyRef } from '@angular/core';

type EditExpenseFormModel = {
  date: string;

  category: string;

  description: string;

  amount: number;
};

@Component({
  selector: 'app-edit-expense',

  standalone: true,

  imports: [CommonModule, ReactiveFormsModule],

  templateUrl: './edit-expense.html',

  styleUrls: ['./edit-expense.css'],
})
export class EditExpenseComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly expenseService = inject(ExpenseService);

  private readonly expenseDataService = inject(ExpenseDataService);

  private readonly destroyRef = inject(DestroyRef);

  // -----------------------------------------------------------------------
  // ------------------INJECT ALERT SERVICE----------------
  // -------------------------------------------------------------------------

  private readonly alertService = inject(AlertService);

  readonly loading$ = this.expenseDataService.loading$;

  errorMsg = '';

  private expenseId: number = 0;

  readonly form = this.fb.group({
    date: ['', Validators.required],

    category: ['', Validators.required],

    description: ['', Validators.required],

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

        this.expenseId = Number(id);

        this.loadExpense();
      },
    });
  }

  private loadExpense(): void {
    const expense = this.expenseService.getExpenseById(this.expenseId);

    if (!expense) {
      this.router.navigate(['/expenses']);

      return;
    }

    this.form.patchValue({
      date: expense.date,

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

    const formData = this.form.getRawValue();

    const updatedExpense: Expense = {
      id: this.expenseId,

      ...formData,
    };

    this.expenseService

      .updateExpense(updatedExpense)

      .subscribe({
        next: () => {
          this.alertService.success('Updated', 'Expense updated successfully');

          this.router.navigate(['/expenses']);
        },

        error: (error: HttpErrorResponse) => {
          this.errorMsg = this.getErrorMessage(error);
          this.alertService.error('Error', 'Could not update expense');
        },
      });
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

  hasError(
    controlName: keyof EditExpenseFormModel,

    errorName: string,
  ): boolean {
    const control = this.form.get(controlName);

    return !!(control?.touched && control.hasError(errorName));
  }

  get f() {
    return this.form.controls;
  }
}
