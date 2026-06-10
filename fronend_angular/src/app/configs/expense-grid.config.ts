// IN THIS FILE TO USEFULL FOR DEFINE THE STRUCTURE OF THE AG-GRID-TABLE

import { ColDef, ValueFormatterParams } from 'ag-grid-community';

import { Expense } from '../models/expense.model';

import { ExpenseActionsRendererComponent } from '../features/components/expense-list/expense-actions-renderer/expense-actions.renderer';

import { formatCurrencyINR } from '../shared/utils/currency-formatter.utils';

export const expenseGridColumnDefs: ColDef<Expense>[] = [
  // DATE COLUMN

  {
    headerName: 'Date',

    field: 'date',

    filter: 'agDateColumnFilter',

    flex: 1,

    minWidth: 130,

    sort: 'desc',

    tooltipField: 'date',
  },

  // CATEGORY COLUMN

  {
    headerName: 'Category',

    field: 'category',

    filter: 'agTextColumnFilter',

    flex: 1,

    minWidth: 140,

    tooltipField: 'category',
  },

  // DESCRIPTION COLUMN

  {
    headerName: 'Description',

    field: 'description',

    filter: 'agTextColumnFilter',

    minWidth: 250,

    flex: 2,

    tooltipField: 'description',

    valueFormatter: (params: ValueFormatterParams<Expense>) => {
      return params.value ?? '-';
    },
  },

  // AMOUNT COLUMN

  {
    headerName: 'Amount',

    field: 'amount',

    

    filter: 'agNumberColumnFilter',

    type: 'numericColumn',

    minWidth: 160,

    cellClass: ['grid-cell', 'grid-cell-amount'],

    tooltipValueGetter: (params) => formatCurrencyINR(params.value),

    valueFormatter: (params: ValueFormatterParams<Expense>) => formatCurrencyINR(params.value),

    cellClassRules: {
      'amount-zero': (params) => params.value === 0,

      'amount-positive': (params) => params.value > 0,
    },
  },

  // ACTIONS COLUMN

  {
    headerName: 'Actions',

    colId: 'actions',

    sortable: false,

    filter: false,

    floatingFilter: false,

    resizable: false,

    suppressMovable: true,

    lockPinned: true,

    pinned: 'right',

    width: 150,

    cellClass: 'grid-actions-cell',

    cellRenderer: ExpenseActionsRendererComponent
  },
];
