import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ExpenseDataService } from './expense-data.service';

describe('ExpenseDataService', () => {
  let service: ExpenseDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ExpenseDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
