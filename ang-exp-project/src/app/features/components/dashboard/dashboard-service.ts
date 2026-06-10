import {
  Injectable
} from '@angular/core';

import {
  tap
} from 'rxjs';

import {
  DashboardApiService
} from '../dashboard/dashboard-api.service';

import {
  DashboardDataService
} from '../dashboard/dashboard-data-service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private dashboardApi:
      DashboardApiService,

    private dashboardDataService:
      DashboardDataService
  ) {}

  loadDashboard(): void {

    this.dashboardApi
        .getSummary()
        .pipe(
          tap((summary) => {

            this.dashboardDataService
                .setDashboardSummary(
                  summary
                );

          })
        )
        .subscribe();

  }

}