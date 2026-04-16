import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../../Services/expense-service';
import { Expense, PaymentMethod } from '../../../Model/expense';

@Component({
  selector: 'app-edit-expense-dialog',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-expense-dialog.html',
  styleUrl: './edit-expense-dialog.css',
})
export class EditExpenseDialog implements OnInit {
  @Input() expense: Expense | null = null;
  @Output() close = new EventEmitter<boolean>();

  editForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage: string = '';
  categories: { id: number; name: string; color: string }[] = [];
  paymentMethods = Object.values(PaymentMethod);

  constructor(
    private formBuilder: FormBuilder,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    this.initializeCategories();
    this.initializeForm();
  }

  private initializeCategories(): void {
    this.categories = [
      { id: 1, name: 'Food & Dining', color: '#FF6B6B' },
      { id: 2, name: 'Transportation', color: '#4ECDC4' },
      { id: 3, name: 'Entertainment', color: '#45B7D1' },
      { id: 4, name: 'Shopping', color: '#96CEB4' },
      { id: 5, name: 'Bills & Utilities', color: '#FFEAA7' },
      { id: 6, name: 'Healthcare', color: '#DDA0DD' },
      { id: 7, name: 'Education', color: '#98D8C8' },
      { id: 8, name: 'Other', color: '#A8A8A8' }
    ];
  }

  private initializeForm(): void {
    if (!this.expense) return;

    this.editForm = this.formBuilder.group({
      categoryId: [this.expense.categoryId, Validators.required],
      amount: [this.expense.amount, [Validators.required, Validators.min(0.01)]],
      date: [this.formatDateForInput(this.expense.date), Validators.required],
      paymentMethod: [this.expense.paymentMethod, Validators.required],
      description: [this.expense.description || ''],
      isRecurring: [this.expense.isRecurring]
    });
  }

  private formatDateForInput(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  get f() {
    return this.editForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.editForm.invalid || !this.expense) {
      return;
    }

    this.loading = true;
    const updatedExpense: Expense = {
      ...this.expense,
      categoryId: this.editForm.value.categoryId,
      amount: this.editForm.value.amount,
      date: new Date(this.editForm.value.date),
      paymentMethod: this.editForm.value.paymentMethod,
      description: this.editForm.value.description || '',
      isRecurring: this.editForm.value.isRecurring
    };

    this.expenseService.updateExpense(this.expense.expenseId, updatedExpense)
      .subscribe({
        next: () => {
          this.close.emit(true); // Emit true to indicate successful update
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to update expense. Please try again.';
          this.loading = false;
        }
      });
  }

  onCancel(): void {
    this.close.emit(false); // Emit false to indicate no changes
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
