export interface ReimbursementRequests {
    requestId: number;     // Primary Key
    userId: number;        // Foreign Key
    expenseId: number;     // Foreign Key
    status: string;
    reviewedBy?: number;
    reviewedAt?: string;
}
