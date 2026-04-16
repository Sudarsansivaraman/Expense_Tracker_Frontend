import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../../Services/expense-service';
import { AuthService } from '../../../Services/auth-service';
import { Expense } from '../../../Model/expense';
import { EditExpenseDialog } from '../edit-expense-dialog/edit-expense-dialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-expense-list',
  imports: [CommonModule, FormsModule, EditExpenseDialog],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList implements OnInit, OnDestroy {
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  loading = false;
  errorMessage: string = '';
  searchTerm: string = '';
  selectedCategory: string = '';
  sortBy: string = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';

  showEditDialog = false;
  selectedExpense: Expense | null = null;

  categories: { id: number; name: string; color: string }[] = [];
  totalAmount: number = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeCategories();
    this.loadExpenses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  loadExpenses(): void {
    this.loading = true;
    this.errorMessage = '';

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'User not authenticated';
      this.loading = false;
      return;
    }

    this.expenseService.getAllExpenses(currentUser.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (expenses) => {
          this.expenses = expenses;
          this.applyFilters();
          this.calculateTotal();
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load expenses. Please try again.';
          this.loading = false;
          console.error('Error loading expenses:', error);
        }
      });
  }

  private applyFilters(): void {
    let filtered = [...this.expenses];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(expense =>
        expense.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.getCategoryName(expense.categoryId).toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(expense => expense.categoryId.toString() === this.selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = this.getCategoryName(a.categoryId).localeCompare(this.getCategoryName(b.categoryId));
          break;
        default:
          comparison = 0;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredExpenses = filtered;
  }

  private calculateTotal(): void {
    this.totalAmount = this.filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  getCategoryColor(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#A8A8A8';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  onSearchChange(): void {
    this.applyFilters();
    this.calculateTotal();
  }

  onCategoryFilterChange(): void {
    this.applyFilters();
    this.calculateTotal();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  addExpense(): void {
    this.router.navigate(['/add-expense']);
  }

  editExpense(expense: Expense): void {
    this.selectedExpense = { ...expense };
    this.showEditDialog = true;
  }

  deleteExpense(expense: Expense): void {
    if (confirm(`Are you sure you want to delete this expense of ${this.formatCurrency(expense.amount)}?`)) {
      this.expenseService.deleteExpense(expense.expenseId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadExpenses(); // Reload the list
          },
          error: (error) => {
            this.errorMessage = 'Failed to delete expense. Please try again.';
            console.error('Error deleting expense:', error);
          }
        });
    }
  }

  onEditDialogClose(updated: boolean): void {
    this.showEditDialog = false;
    this.selectedExpense = null;
    if (updated) {
      this.loadExpenses(); // Reload the list if expense was updated
    }
  }
}
