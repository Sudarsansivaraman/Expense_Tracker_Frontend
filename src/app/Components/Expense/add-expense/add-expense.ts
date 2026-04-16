import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../../Services/expense-service';
import { Expense, PaymentMethod } from '../../../Model/expense';
import { Category } from '../../../Model/category';
import { AuthService } from '../../../Services/auth-service';

@Component({
  selector: 'app-add-expense',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css',
})
export class AddExpense implements OnInit {
  expenseForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage: string = '';
  successMessage: string = '';
  categories: Category[] = [];
  paymentMethods = Object.values(PaymentMethod);

  constructor(
    private formBuilder: FormBuilder,
    private expenseService: ExpenseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
  }

  private initializeForm(): void {
    this.expenseForm = this.formBuilder.group({
      categoryId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      paymentMethod: ['', Validators.required],
      description: [''],
      isRecurring: [false]
    });
  }

  private loadCategories(): void {
    // For now, using mock categories. In real app, fetch from API
    this.categories = [
      { categoryId: 1, name: 'Food & Dining', colorCode: '#FF6B6B' },
      { categoryId: 2, name: 'Transportation', colorCode: '#4ECDC4' },
      { categoryId: 3, name: 'Entertainment', colorCode: '#45B7D1' },
      { categoryId: 4, name: 'Shopping', colorCode: '#96CEB4' },
      { categoryId: 5, name: 'Bills & Utilities', colorCode: '#FFEAA7' },
      { categoryId: 6, name: 'Healthcare', colorCode: '#DDA0DD' },
      { categoryId: 7, name: 'Education', colorCode: '#98D8C8' },
      { categoryId: 8, name: 'Other', colorCode: '#A8A8A8' }
    ];
  }

  get f() {
    return this.expenseForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.expenseForm.invalid) {
      return;
    }

    this.loading = true;
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.errorMessage = 'User not authenticated';
      this.loading = false;
      return;
    }

    const expenseData: Expense = {
      expenseId: 0, // Will be set by backend
      userId: currentUser.userId,
      categoryId: this.expenseForm.value.categoryId,
      amount: this.expenseForm.value.amount,
      date: new Date(this.expenseForm.value.date),
      paymentMethod: this.expenseForm.value.paymentMethod,
      description: this.expenseForm.value.description || '',
      isRecurring: this.expenseForm.value.isRecurring,
      createdAt: new Date()
    };

    this.expenseService.addExpense(expenseData).subscribe({
      next: (response) => {
        this.successMessage = 'Expense added successfully!';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/expenses']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to add expense. Please try again.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/expenses']);
  }
}
