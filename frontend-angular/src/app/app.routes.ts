import { ChildrenOutletContexts, Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Dashboard } from './features/components/dashboard/dashboard';
import { ExpenseListComponent } from './features/components/expense-list/expense-list';
import { AddExpenseComponent } from './features/components/add-expense/add-expense';
import { EditExpenseComponent } from './features/components/edit-expense/edit-expense';
import { Profile } from './features/components/profile/profile';

import { RegisterComponent } from '../app/page/register-component/register-component';
import { LoginComponent } from './page/register-component/login-component/login-component';
import { authGuard } from './core/guards/auth-guard';

import { guestGuard } from './core/guards/guest.guard';

// IT IS ROUTING CONFIG OR TO TELL ANGULAR [ URL->WHICH COMPONENT]
export const routes: Routes = [
  // ------------------------------AUTH ROUTES----------------------------- //

  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },

  // -----------------------------MAIN APP LAYOUT-------------------------- //
  // PATH -> BROWSER URL
  //  PATH:"" ->ROOT URL
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],

    children: [
      //  REDIRECT =>Default page set panna
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'expenses', component: ExpenseListComponent },
      { path: 'expenses/add', component: AddExpenseComponent },
      { path: 'expenses/edit/:id', component: EditExpenseComponent },
      { path: 'profile', component: Profile },
    ],
  },
];
