import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router, RouterModule } from '@angular/router';

import { Observable } from 'rxjs';

import { filter, map } from 'rxjs/operators';

import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';

import { DashboardService } from '../dashboard/dashboard-service';

import { DashboardDataService } from '../dashboard/dashboard-data-service';

import { DashboardSummary, CategoryBreakdown } from '../../../models/dashboard.model';

import { AuthService } from '../features/auth/auth.service';

import { Expense } from '../../../models/expense.model';

export interface DashboardViewModel {
  total_expense: number;
  expense_count: number;
  highest_expense: number;
  top_category: string;
  category_breakdown: CategoryBreakdown[];
  recent_expenses: Expense[];
  thisMonthTotal: number;
  lastMonthTotal: number;
  monthChangePercent: number;
}

@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],

  templateUrl: './dashboard.html',

  styleUrls: ['./dashboard.css'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  private readonly dashboardDataService = inject(DashboardDataService);

  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  readonly currentUser$ = this.authService.currentUser$;

  readonly vm$: Observable<DashboardViewModel> = this.dashboardDataService.dashboardSummary$.pipe(
    filter((summary): summary is DashboardSummary => summary !== null),
    map((summary) => this.buildViewModel(summary)),
  );

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.dashboardService.loadDashboard();
  }

  private buildViewModel(summary: DashboardSummary): DashboardViewModel {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const recentExpenses: Expense[] = summary.recent_expenses ?? [];
    const categoryBreakdown: CategoryBreakdown[] = summary.category_breakdown ?? [];

    const thisMonthTotal = recentExpenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const lastMonthTotal = recentExpenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const monthChangePercent =
      lastMonthTotal > 0
        ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
        : thisMonthTotal > 0
          ? 100
          : 0;

    return {
      total_expense: summary.total_expense,
      expense_count: summary.expense_count,
      highest_expense: summary.highest_expense,
      top_category: summary.top_category,
      category_breakdown: categoryBreakdown,
      recent_expenses: recentExpenses,
      thisMonthTotal,
      lastMonthTotal,
      monthChangePercent,
    };
  }

  trackByCategoryItem(_index: number, category: CategoryBreakdown): string {
    return category.category;
  }

  trackByExpenseId(_index: number, expense: Expense): number {
    return expense.id;
  }

  logout(): void {
    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
