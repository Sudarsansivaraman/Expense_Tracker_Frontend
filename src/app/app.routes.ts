import { Routes } from '@angular/router';
import { Login } from './Components/Auth/login/login';
import { Register } from './Components/Auth/register/register';
import { AddExpense } from './Components/Expense/add-expense/add-expense';
import { ExpenseList } from './Components/Expense/expense-list/expense-list';
import { loginGuard, authGuard } from './Guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login, },
  { path: 'register', component: Register,  },
  { path: 'expenses', component: ExpenseList, },
  { path: 'add-expense', component: AddExpense, },
  // Add more protected routes here as needed
];
