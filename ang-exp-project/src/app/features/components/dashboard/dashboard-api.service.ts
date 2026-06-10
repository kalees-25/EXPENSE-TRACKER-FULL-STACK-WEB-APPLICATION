import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

import { DashboardSummary } from '../../../models/dashboard.model';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {
  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {

    return this.http.get<DashboardSummary>(

      `${environment.apiBaseUrl}/dashboard/summary`);

  }

}
