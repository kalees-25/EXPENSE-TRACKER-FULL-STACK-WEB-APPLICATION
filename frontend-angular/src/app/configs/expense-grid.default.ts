import { ColDef } from 'ag-grid-community';

import { Expense } from '../models/expense.model';

export const expenseDefaultColDef: ColDef<Expense> = {
  sortable: true,

  filter: true,

  floatingFilter: true,

  resizable: true,

  flex: 1,

  //   INDIVIDUAL COLUMN SETTINGS
  cellClass: 'grid-cell',

  filterParams: {
    buttons: [ 'apply', 'reset'],
  },
};
