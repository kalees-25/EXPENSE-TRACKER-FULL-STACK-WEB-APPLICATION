//  Methods provided by the parent component and accessed inside the renderer component.



import {Expense} from './expense.model';

import { ICellRendererParams } from 'ag-grid-community';


export interface ExpenseGridRowActionContext {
  componentParent: {
    onEditExpense: (expense: Expense) => void;
    onDeleteExpense: (expense: Expense) => void;
  };
}


//ALREADY EXISTING INTERFACE FROM AG-GRID [TYPE]
export type ExpenseActionRendererParams = ICellRendererParams<Expense ,
unknown , ExpenseGridRowActionContext>