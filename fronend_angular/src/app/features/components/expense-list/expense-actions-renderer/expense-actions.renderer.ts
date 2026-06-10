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
  styles: [`
    .actions-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 100%;
    }
    .cell-action-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 500;
      font-family: inherit;
      border-radius: 6px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: background-color 0.15s ease;
      white-space: nowrap;
      line-height: 1.5;
    }
    .cell-edit-btn {
      background-color: rgba(73, 62, 229, 0.08);
      color: #493ee5;
      border-color: rgba(73, 62, 229, 0.2);
    }
    .cell-edit-btn:hover { background-color: rgba(73, 62, 229, 0.16); }
    .cell-delete-btn {
      background-color: rgba(186, 26, 26, 0.08);
      color: #ba1a1a;
      border-color: rgba(186, 26, 26, 0.2);
    }
    .cell-delete-btn:hover { background-color: rgba(186, 26, 26, 0.16); }
  `],
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
