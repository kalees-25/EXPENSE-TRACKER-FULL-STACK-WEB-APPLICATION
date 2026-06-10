import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Expense, ExpenseListResponse } from '../../../models/expense.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExpenseApi {
  private readonly apiUrl = `${environment.apiBaseUrl}/expenses`;

  constructor(private readonly http: HttpClient) {}

  getExpenses(
    page: number,
    pageSize: number,
    search?: string,
    category?: string,
    sortBy?: string,
    sortOrder?: string,

  ): Observable<ExpenseListResponse> {
    
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (category) {
      params = params.set('category', category);
    }

    if (sortBy) {
      params = params.set('sort_by', sortBy);
    }

    if (sortOrder) {
      params = params.set('sort_order', sortOrder);
    }

    return this.http.get<ExpenseListResponse>(this.apiUrl, { params });
  }

  addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }

  updateExpense(id: number, expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${id}`, expense);
  }

  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }
}
