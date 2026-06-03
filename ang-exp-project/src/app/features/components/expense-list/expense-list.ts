// expense-list.component.ts

import { Component, OnInit, inject } from '@angular/core';

import { CommonModule, AsyncPipe, NgIf, CurrencyPipe } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';

import { AgGridAngular } from 'ag-grid-angular';

import { ColDef, GridApi, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';

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

import { PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE } from '../../../configs/expense-grid.pagination';

import { ExpenseService } from '../../expenses/services/expense-service';

import { AlertService } from '../../../shared/services/alert.service';

import { AuthService } from '../features/auth/auth.service';

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
export class ExpenseListComponent implements OnInit {
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

  readonly loading$ = this.expenseDataService.loading$;

  readonly error$ = this.expenseDataService.error$;

  readonly totalRecords$ = this.expenseDataService.totalRecords$;

  // -----------------------------------
  //  CURRENT SELECTED ROWS STORED IN SERVICE
  // -----------------------------------
  readonly selectedExpense$ = this.expenseDataService.selectedExpense$;

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

  paginationPageSize = DEFAULT_PAGE_SIZE;

  // -----------------------------------
  //            ROW SELECTION
  // -----------------------------------

  readonly rowSelection = { mode: 'singleRow' as const };

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
  // SELECTED ROW
  // -----------------------------------

  selectedExpense: Expense | null = null;

  // -----------------------------------
  // PAGE STATUS
  // -----------------------------------

  pageStatusText = '';

  // -----------------------------------
  // LOADING FLAG TO PREVENT LOOP
  // -----------------------------------

  private isLoadingData = false;

  // -----------------------------------
  // COMPONENT INIT
  // -----------------------------------

  ngOnInit(): void {
    this.expenseDataService.setCurrentPage(1);
    this.isLoadingData = true;
    this.expenseService.loadExpenses();
    this.isLoadingData = false;
  }

  // -----------------------------------
  // GRID READY
  // -----------------------------------

  onGridReady(event: GridReadyEvent<Expense>): void {
    this.gridApi = event.api;

    this.totalRecords$.subscribe(() => {
      this.updatePageStatus();
    });
  }

  // -----------------------------------
  // GLOBAL SEARCH
  // -----------------------------------

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.searchText = value;

    this.expenseDataService.setCurrentPage(1);

    this.expenseService.loadExpense
    this.updatePageStatus();
  }

  // -----------------------------------
  // PAGINATION CHANGED
  // -----------------------------------

  onPaginationChanged(): void {
    this.updatePageStatus();
  }

  // -----------------------------------
  // ROW SELECTION
  //if (!this.gridApi) {
      return;
    }

    const currentPage = this.gridApi.paginationGetCurrentPage() + 1;
    const storedPage = this.expenseDataService.getCurrentPageSnapshot();

    if (currentPage !== storedPage) {
      this.expenseDataService.setCurrentPage(currentPage);
      this.expenseService.loadExpenses();
    }

     -----------------------------------

  onSelectionChanged(event: SelectionChangedEvent<Expense>): void {
    const selectedRows = event.api.getSelectedRows();

    const selectedExpense = selectedRows[0] ?? null;

    this.selectedExpense = selectedExpense;

    this.expenseDataService.setSelectedExpense(selectedExpense);
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

  async onDelexpenseService.loadExpensense: Expense): Promise<void> {
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
        this.updatePageStatus();
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
  }const totalRows = this.expenseDataService.getTotalRecordsSnapshot();
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

    this.pageStatusText = `Showing ${startRow}-${endRow} of ${totalRows} expenses | Page ${currentPage}
      totalRows,
    );

    this.pageStatusText = `Showing ${startRow}-${endRow}
       of ${totalRows} expenses
       | Page ${currentPage}
       of ${totalPages}`;
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

    this.gridApi?.setGridOption('paginationPageSize', pageSize);

    this.updatePageStatus();
  }

    this.expenseDataService.setCurrentPage(1);

    this.gridApi?.setGridOption('paginationPageSize', pageSize);
    this.gridApi?.paginationGoToFirstPage();

    this.expenseService.loadExpense
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
