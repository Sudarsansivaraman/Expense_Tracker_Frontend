import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expense } from '../Model/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private apiUrl = 'https://localhost:7255/api/expenses';

  constructor(private http: HttpClient) {}

  // ➕ Create Expense
  addExpense(expense: Expense): Observable<any> {
    return this.http.post(this.apiUrl, expense);
  }

  // 📋 Get All Expenses (with optional filtering)
  getAllExpenses(userId?: number, startDate?: Date, endDate?: Date): Observable<Expense[]> {
    let params = new HttpParams();

    if (userId) {
      params = params.set('userId', userId.toString());
    }
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }

    return this.http.get<Expense[]>(this.apiUrl, { params });
  }

  // 🔍 Get Expense by ID
  getExpenseById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  // ✏️ Update Expense
  updateExpense(id: number, expense: Expense): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, expense);
  }

  // ❌ Delete Expense
  deleteExpense(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}