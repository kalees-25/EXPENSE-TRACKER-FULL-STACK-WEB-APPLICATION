import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExpenseComponent } from './edit-expense';

describe('EditExpenseComponent', () => {
  let component: EditExpenseComponent;
  let fixture: ComponentFixture<EditExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExpenseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditExpenseComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
