import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Expense } from '../../../models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseDataService {
  // ------------------------------------
  // GRID DATA
  // ------------------------------------

  private readonly expensesSubject = new BehaviorSubject<Expense[]>([]);

  readonly expenses$ = this.expensesSubject.asObservable();

  // ------------------------------------
  // LOADING
  // ------------------------------------

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  readonly loading$ = this.loadingSubject.asObservable();

  // ------------------------------------
  // ERROR
  // ------------------------------------

  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  readonly error$ = this.errorSubject.asObservable();

  // ------------------------------------
  // SELECTED EXPENSE - CURRENT SELECTED ROW
  // ------------------------------------

  private readonly selectedExpenseSubject = new BehaviorSubject<Expense | null>(null);

  readonly selectedExpense$ = this.selectedExpenseSubject.asObservable();

  // ------------------------------------
  // SEARCH
  // ------------------------------------

  private readonly searchTextSubject = new BehaviorSubject<string>('');

  readonly searchText$ = this.searchTextSubject.asObservable();

  // ------------------------------------
  // PAGINATION
  // ------------------------------------

  private readonly pageSizeSubject = new BehaviorSubject<number>(10);



  //  OBSERVABLE
  readonly pageSize$ = this.pageSizeSubject.asObservable();

  private readonly currentPageSubject = new BehaviorSubject<number>(1);

  readonly currentPage$ = this.currentPageSubject.asObservable();

  private readonly totalRecordsSubject = new BehaviorSubject<number>(0);

  readonly totalRecords$ = this.totalRecordsSubject.asObservable();

  // ------------------------------------
  // GRID DATA
  // ------------------------------------

  setExpenses(expenses: Expense[]): void {
    this.expensesSubject.next(expenses);
  }

  // ---------GET CURRENT EXPENSES---------
  getExpensesSnapshot(): Expense[] {
    return this.expensesSubject.value;
  }

  // ------------------------------------
  // LOADING
  // ------------------------------------

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  // ------------------------------------
  // ERROR
  // ------------------------------------

  setError(error: string | null): void {
    this.errorSubject.next(error);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  // ------------------------------------
  // SELECTION - CURRENT SELECTED ROW UPDATE
  // ------------------------------------

  setSelectedExpense(expense: Expense | null): void {
    this.selectedExpenseSubject.next(expense);
  }

  // ------------------------------------
  // SEARCH
  // ------------------------------------

  setSearchText(searchText: string): void {
    this.searchTextSubject.next(searchText);
  }

  // ------------------------------------
  // PAGINATION
  // ------------------------------------

  setPageSize(pageSize: number): void {
    this.pageSizeSubject.next(pageSize);
  }

  setCurrentPage(page: number): void {
    this.currentPageSubject.next(page);
  }

  setTotalRecords(total: number): void {
    this.totalRecordsSubject.next(total);
  }

  getTotalRecordsSnapshot(): number {
    return this.totalRecordsSubject.value;
  }

  getPageSizeSnapshot(): number {
    return this.pageSizeSubject.value;
  }

  getCurrentPageSnapshot(): number {
    return this.currentPageSubject.value;
  }

  getSearchTextSnapshot(): string {
    return this.searchTextSubject.value;
  }
}
