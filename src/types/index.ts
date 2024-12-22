export interface User {
  username: string;
  password: string;
  loginAttempts: number;
  lastLoginAttempt?: number;
  isLocked: boolean;
}

export interface Account {
  accountNumber: string;
  type: 'savings' | 'checking';
  balance: number;
  userId: string;
}

export interface Transaction {
  id: string;
  accountNumber: string;
  type: 'deposit' | 'withdrawal' | 'transfer-in' | 'transfer-out';
  amount: number;
  timestamp: number;
  balance: number;
  relatedAccountNumber?: string;
}