import { Users } from './users';
import { Category } from './category';
export interface Expense {
  expenseId: number;

  userId: number;
  user?: Users; // optional (used when needed)

  categoryId: number;
  category?: Category;

  amount: number;
  date: Date;

  paymentMethod: PaymentMethod;

  description?: string;
  isRecurring: boolean;

  createdAt: Date;
}
export enum PaymentMethod {
  Cash = 'Cash',
  UPI = 'UPI'
}