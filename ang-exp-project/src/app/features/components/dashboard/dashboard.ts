import { CommonModule, KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { map, shareReplay } from 'rxjs';

import { ExpenseService } from '../../expenses/services/expense-service';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Expense } from '../../../models/expense.model';
import { ExpenseDataService } from '../../expenses/services/expense-data.service';
import { AuthService } from '../features/auth/auth.service';

type DashboardViewModel = {
  totalExpense: number;
  expenseCount: number;
  topCategory: string;
  topCategoryAmount: number;
  recentExpenses: Expense[];
  categoryTotals: Record<string, number>;
  thisMonthTotal: number;
  lastMonthTotal: number;
  monthChangePercent: number;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly expenseDataService = inject(ExpenseDataService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly expenseService = inject(ExpenseService);

  readonly currentUser$ = this.authService.currentUser$;

  readonly vm$ = this.expenseDataService.expenses$.pipe(
    map((expenses) => this.buildViewModel(expenses)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  ngOnInit(): void {
    this.expenseService.loadExpenses();
  }

  private buildViewModel(expenses: Expense[]): DashboardViewModel {
    const normalizedExpenses = expenses.map((exp) => ({
      ...exp,
      amount: Number(exp.amount || 0),
    }));

    const totalExpense = normalizedExpenses.reduce((total, exp) => total + exp.amount, 0);

    const expenseCount = normalizedExpenses.length;

    const categoryTotals = normalizedExpenses.reduce(
      (acc, exp) => {
        const category = exp.category?.trim() || 'Uncategorized';
        acc[category] = (acc[category] || 0) + exp.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    const topCategoryEntry = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    const recentExpenses = [...normalizedExpenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const lastMonthDate = new Date(now);
    lastMonthDate.setMonth(now.getMonth() - 1);

    const lastMonth = lastMonthDate.getMonth();
    const lastYear = lastMonthDate.getFullYear();

    const thisMonthTotal = normalizedExpenses
      .filter((exp) => {
        const d = new Date(exp.date);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    const lastMonthTotal = normalizedExpenses
      .filter((exp) => {
        const d = new Date(exp.date);
        return d.getMonth() === lastMonth && d.getFullYear() === lastYear;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    const monthChangePercent =
      lastMonthTotal > 0
        ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
        : thisMonthTotal > 0
          ? 100
          : 0;

    return {
      totalExpense,
      expenseCount,
      topCategory: topCategoryEntry?.[0] ?? 'N/A',
      topCategoryAmount: topCategoryEntry?.[1] ?? 0,
      recentExpenses,
      categoryTotals,
      thisMonthTotal,
      lastMonthTotal,
      monthChangePercent,
    };
  }

  trackByExpenseId(index: number, expense: Expense): number | string {
    return expense.id ?? index;
  }

  trackByCategory(_: number, item: KeyValue<string, number>): string {
    return item.key;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
