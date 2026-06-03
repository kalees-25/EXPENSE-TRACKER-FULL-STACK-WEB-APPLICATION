import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ExpenseApi } from './expense-api';

describe('ExpenseApi', () => {
  let service: ExpenseApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ExpenseApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
