//  THIS COMPONENT ONLY HANDLES  UI RENDERING , BUTTON CLICK EMITS TO PARENT

//  Renderer event trigger pannum
//         |

// Parent component handle pannum
//                  |
// Service business logic pannum

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Component } from '@angular/core';
import { Expense } from '../../../../models/expense.model';
import { CommonModule } from '@angular/common';
import { ExpenseActionRendererParams } from '../../../../models/expense-grid.model';

@Component({
  selector: 'app-expense-actions-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-actions-renderer.component.html',
})
export class ExpenseActionsRendererComponent implements ICellRendererAngularComp {
  //  ------------------------------------
  //     GRID PARAMS
  // ---------------------------------
  private params!: ExpenseActionRendererParams;

  // -----------------------------------
  // CELL INITIALIZATION
  // -----------------------------------

  agInit(params: ExpenseActionRendererParams): void {
    this.params = params;
  }

  // -----------------------------------
  // CELL REFRESH
  // -----------------------------------

  refresh(params: ExpenseActionRendererParams): boolean {
    this.params = params;

    return true;
  }
  //  // -----------------------------------
  // CURRENT ROW 
  // -----------------------------------

  private get expense(): Expense {
    return this.params.data!;
  }
  // -----------------------------------
  // EDIT ACTION
  // -----------------------------------

  onEdit(): void {
    this.params.context.componentParent.onEditExpense(this.expense);
  }

  // -----------------------------------
  // DELETE ACTION
  // -----------------------------------

  onDelete(): void {
    this.params.context.componentParent.onDeleteExpense(this.expense);
  }
}
