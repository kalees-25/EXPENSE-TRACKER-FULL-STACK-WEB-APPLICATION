import { AsyncPipe } from '@angular/common';
import { Component, inject as coreInject } from '@angular/core';
import { LoadingService } from '../../core/services/loading-service';

@Component({
  selector: 'app-loading-spinner',
  imports: [AsyncPipe],
  standalone: true,
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.css',
})
export class LoadingSpinner {
  private loadingService = coreInject(LoadingService);

  loading$ = this.loadingService.loading$;
}
