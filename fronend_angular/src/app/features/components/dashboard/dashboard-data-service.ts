import {
  Injectable
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs';

import {
  DashboardSummary
} from '../../../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  private dashboardSummarySubject =
    new BehaviorSubject<
      DashboardSummary | null
    >(null);

  readonly dashboardSummary$ =
    this.dashboardSummarySubject
        .asObservable();

  setDashboardSummary(
    summary: DashboardSummary
  ): void {

    this.dashboardSummarySubject
        .next(summary);

  }

  getDashboardSummarySnapshot():
    DashboardSummary | null {

    return this
      .dashboardSummarySubject
      .value;

  }

}