import { Injectable } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';

import { Expense } from '../../../models/expense.model';
import { ExpenseApi } from './expense-api';

import { ExpenseDataService } from './expense-data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(
    private readonly expenseApi: ExpenseApi,
    private readonly expenseDataService: ExpenseDataService,
  ) {}

  loadExpenses(): void {
    this.expenseDataService.setLoading(true);
    this.expenseDataService.clearError();

    const page = this.expenseDataService.getCurrentPageSnapshot();
    const pageSize = this.expenseDataService.getPageSizeSnapshot();
    const search = this.expenseDataService.getSearchTextSnapshot();

    this.expenseApi
      .getExpenses(page, pageSize, search)
      .pipe(
        finalize(() => {
          this.expenseDataService.setLoading(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.expenseDataService.setExpenses(response.items);
          this.expenseDataService.setTotalRecords(response.total);
        },
        error: () => {
          this.expenseDataService.setError('Failed to load expenses');
        },
      });
  }

  // -------ADD EXPENSE-------
  addExpense(expense: Expense): Observable<Expense> {
    this.expenseDataService.setLoading(true);
    this.expenseDataService.clearError();

    return this.expenseApi.addExpense(expense).pipe(
      tap((newExpense) => {
        const currentExpenses = this.expenseDataService.getExpensesSnapshot();
        this.expenseDataService.setExpenses([...currentExpenses, newExpense]);
      }),
      finalize(() => {
        this.expenseDataService.setLoading(false);
      }),
      catchError((error) => {
        this.expenseDataService.setError('Failed to add expense');
        throw error;
      }),
    );
  }

  // -------UPDATE EXPENSE-------
  updateExpense(updatedExpense: Expense): Observable<Expense> {
    if (!updatedExpense.id) {
      throw new Error('Expense id is required');
    }

    this.expenseDataService.setLoading(true);
    this.expenseDataService.clearError();

    return this.expenseApi.updateExpense(updatedExpense.id, updatedExpense).pipe(
      tap((expenseFromApi) => {
        const expenses = this.expenseDataService.getExpensesSnapshot();
        const updatedState = expenses.map((expense) =>
          expense.id === expenseFromApi.id ? expenseFromApi : expense,
        );
        this.expenseDataService.setExpenses(updatedState);
      }),
      finalize(() => {
        this.expenseDataService.setLoading(false);
      }),
      catchError((error) => {
        this.expenseDataService.setError('Failed to update expense');
        throw error;
      }),
    );
  }

  //  -------DELETE EXPENSE-------
  deleteExpense(id: number): Observable<void> {
    this.expenseDataService.setLoading(true);
    this.expenseDataService.clearError();

    return this.expenseApi.deleteExpense(id).pipe(
      tap(() => {
        const expenses = this.expenseDataService.getExpensesSnapshot();
        const updatedState = expenses.filter((expense) => expense.id !== id);
        this.expenseDataService.setExpenses(updatedState);
      }),
      finalize(() => {
        this.expenseDataService.setLoading(false);
      }),
      catchError((error) => {
        this.expenseDataService.setError('Failed to delete expense');
        throw error;
      }),
    );
  }

  // -------GET EXPENSE BY ID-------
  getExpenseById(id: number): Expense | undefined {
    return this.expenseDataService.getExpensesSnapshot().find((expense) => expense.id === id);
  }
}
