// expense-list.component.ts

import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { Subject, Subscription, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { CommonModule, AsyncPipe, NgIf, CurrencyPipe } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';

import { AgGridAngular } from 'ag-grid-angular';

import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';

import { Expense } from '../../../models/expense.model';

import { ExpenseDataService } from '../../../features/expenses/services/expense-data.service';

import { expenseGridColumnDefs } from '../../../configs/expense-grid.config';

import { expenseDefaultColDef } from '../../../configs/expense-grid.default';


import { ExpenseService } from '../../expenses/services/expense-service';

import { AlertService } from '../../../shared/services/alert.service';

import { AuthService } from '../features/auth/auth.service';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

// -----------------------------------SWEET-ALERT-----------------------------------

@Component({
  selector: 'app-expense-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    AsyncPipe,
    NgIf,
    CurrencyPipe,
    AgGridAngular,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
  ],

  templateUrl: './expense-list.html',

  styleUrls: ['./expense-list.css'],
})
export class ExpenseListComponent implements OnInit, OnDestroy {
  // -----------------------------------
  //  INJECT SERVICES
  // -----------------------------------
  private readonly expenseService = inject(ExpenseService);

  private readonly expenseDataService = inject(ExpenseDataService);

  private readonly router = inject(Router);

  private readonly alertService = inject(AlertService);

  private readonly authService = inject(AuthService);

  // -----------------------------------
  //  GRID API
  // -----------------------------------

  private gridApi!: GridApi<Expense>;

  // -----------------------------------
  // OBSERVABLE STATE
  // -----------------------------------

  readonly expenses$ = this.expenseDataService.expenses$;

  readonly currentUser$ = this.authService.currentUser$;

  readonly loading$ = this.expenseDataService.loading$;

  readonly error$ = this.expenseDataService.error$;

  readonly totalRecords$ = this.expenseDataService.totalRecords$;

  readonly currentPage$ = this.expenseDataService.currentPage$;

  readonly totalPages$ = combineLatest([
    this.expenseDataService.totalRecords$,
    this.expenseDataService.pageSize$,
  ]).pipe(map(([total, size]) => Math.ceil(total / size) || 1));

  // -----------------------------------
  //  SEARCH TEXT STORED IN SERVICE
  // -----------------------------------
  readonly searchText$ = this.expenseDataService.searchText$;

  // -----------------------------------
  //  PAGE SIZE STORED IN SERVICE
  // -----------------------------------

  readonly pageSize$ = this.expenseDataService.pageSize$;

  // -----------------------------------
  // GRID CONFIG
  // -----------------------------------

  readonly columnDefs: ColDef<Expense>[] = expenseGridColumnDefs;

  readonly defaultColDef: ColDef<Expense> = expenseDefaultColDef;

  // -----------------------------------
  // PAGINATION
  // -----------------------------------

  readonly pageSizeOptions = PAGE_SIZE_OPTIONS;

  paginationPageSize = this.expenseDataService.getPageSizeSnapshot();

  // -----------------------------------
  //            GRID CONTEXT
  // -----------------------------------

  readonly gridContext = {
    componentParent: this,
  };

  // -----------------------------------
  // SEARCH
  // -----------------------------------

  searchText = '';

  // -----------------------------------
  // PAGE STATUS
  // -----------------------------------

  pageStatusText = '';

  // -----------------------------------
  // SUBSCRIPTIONS
  // -----------------------------------

  private readonly searchSubject = new Subject<string>();

  private readonly subscriptions = new Subscription();

  // -----------------------------------
  // COMPONENT INIT
  // -----------------------------------

  ngOnInit(): void {
    this.expenseDataService.setCurrentPage(1);

    this.subscriptions.add(
      this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((value) => {
        this.expenseDataService.setSearchText(value);
        this.expenseDataService.setCurrentPage(1);
        this.expenseService.loadExpenses();
      }),
    );

    this.subscriptions.add(
      this.totalRecords$.subscribe(() => {
        this.updatePageStatus();
      }),
    );

    this.expenseService.loadExpenses();
  }

  // -----------------------------------
  // COMPONENT DESTROY
  // -----------------------------------

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // -----------------------------------
  // GRID READY
  // -----------------------------------

  onGridReady(event: GridReadyEvent<Expense>): void {
    this.gridApi = event.api;
  }

  // -----------------------------------
  // GLOBAL SEARCH
  // -----------------------------------

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.searchText = value;

    this.searchSubject.next(value);
  }

  // -----------------------------------
  // EDIT ACTION
  // -----------------------------------

  onEditExpense(expense: Expense): void {
    this.expenseDataService.setSelectedExpense(expense);

    this.router.navigate(['/expenses/edit', expense.id]);

    // ---------------------------------
    // FUTURE IMPLEMENTATION
    // ---------------------------------

    // Open modal
    // Navigate edit form
    // Patch reactive form
    // Drawer editing
  }

  // -----------------------------------
  // DELETE ACTION
  // -----------------------------------

  async onDeleteExpense(expense: Expense): Promise<void> {
    const result = await this.alertService.confirmDelete(
      'Delete Expense',
      `"${expense.description}" will be removed permanently.`,
    );

    if (!result.isConfirmed) {
      return;
    }
    this.expenseService.deleteExpense(expense.id).subscribe({
      next: () => {
        this.alertService.success('Deleted', 'Expense was deleted successfuly');
        this.expenseService.loadExpenses();
      },
      error: () => {
        this.alertService.error('Delete Failed', 'Unable to remove expense');
      },
    });
  }

  // -----------------------------------
  // EXPORT CSV
  // -----------------------------------

  exportCsv(): void {
    if (!this.gridApi) {
      return;
    }
    // CALL IN BUILT METHOD -> exportDataAsCsv
    this.gridApi.exportDataAsCsv({
      fileName: 'expenses.csv',
    });
  }

  // -----------------------------------
  // UPDATE CURRENT PAGE STATUS
  // -----------------------------------

  private updatePageStatus(): void {
    const totalRows = this.expenseDataService.getTotalRecordsSnapshot();
    const pageSize = this.expenseDataService.getPageSizeSnapshot();
    const currentPage = this.expenseDataService.getCurrentPageSnapshot();

    // ---------------------------------
    // EMPTY STATE
    // ---------------------------------

    if (!totalRows) {
      this.pageStatusText = 'No expenses found';
      return;
    }

    const totalPages = Math.ceil(totalRows / pageSize);
    const startRow = (currentPage - 1) * pageSize + 1;
    const endRow = Math.min(currentPage * pageSize, totalRows);

    this.pageStatusText = `Showing ${startRow}-${endRow} of ${totalRows} expenses | Page ${currentPage} of ${totalPages}`;
  }

  // -----------------------------------
  // STATISTICS HELPERS
  // -----------------------------------

  getTotalExpenses(expenses: Expense[]): number {
    return expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  }

  getTopCategory(expenses: Expense[]): string {
    if (!expenses.length) return 'N/A';

    const categoryTotals = expenses.reduce(
      (acc, exp) => {
        const category = exp.category?.trim() || 'Uncategorized';
        acc[category] = (acc[category] || 0) + Number(exp.amount || 0);
        return acc;
      },
      {} as Record<string, number>,
    );

    const topEntry = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    return topEntry?.[0] ?? 'N/A';
  }

  getThisMonthTotal(expenses: Expense[]): number {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    return expenses
      .filter((exp) => {
        const d = new Date(exp.date);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      })
      .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  }

  // -----------------------------------
  // PAGE NAVIGATION
  // -----------------------------------

  goToNextPage(): void {
    const currentPage = this.expenseDataService.getCurrentPageSnapshot();
    const total = this.expenseDataService.getTotalRecordsSnapshot();
    const pageSize = this.expenseDataService.getPageSizeSnapshot();
    const totalPages = Math.ceil(total / pageSize);

    if (currentPage < totalPages) {
      this.expenseDataService.setCurrentPage(currentPage + 1);
      this.expenseService.loadExpenses();
    }
  }

  goToPrevPage(): void {
    const currentPage = this.expenseDataService.getCurrentPageSnapshot();

    if (currentPage > 1) {
      this.expenseDataService.setCurrentPage(currentPage - 1);
      this.expenseService.loadExpenses();
    }
  }

  // -----------------------------------
  // PAGE SIZE CHANGE (Mat-Select)
  // -----------------------------------

  onPageSizeChange(event: MatSelectChange | Event): void {
    let pageSize: number;

    if ('value' in event) {
      pageSize = event.value;
    } else {
      pageSize = Number((event.target as HTMLSelectElement).value);
    }

    this.paginationPageSize = pageSize;

    this.expenseDataService.setPageSize(pageSize);
    this.expenseDataService.setCurrentPage(1);

    this.expenseService.loadExpenses();
  }

  // -----------------------------------
  // EXPORT FUNCTIONS
  // -----------------------------------

  exportToCSV(): void {
    if (!this.gridApi) return;
    this.gridApi.exportDataAsCsv({
      fileName: `expenses_${new Date().toISOString().split('T')[0]}.csv`,
    });
    this.alertService.success('Export Complete', 'CSV file downloaded successfully');
  }

  exportToExcel(): void {
    if (!this.gridApi) return;
    // AG Grid Enterprise feature - fallback to CSV for community
    this.gridApi.exportDataAsCsv({
      fileName: `expenses_${new Date().toISOString().split('T')[0]}.csv`,
    });
    this.alertService.success('Export Complete', 'Excel file downloaded successfully');
  }

  exportToPDF(): void {
    // PDF export requires additional library (jsPDF)
    this.alertService.success('PDF Export', 'PDF export feature coming soon');
  }

  // -----------------------------------
  // LOGOUT
  // -----------------------------------

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // -----------------------------------
  // LOAD EXPENSES (Public)
  // -----------------------------------

  loadExpenses(): void {
    this.expenseService.loadExpenses();
  }
}
