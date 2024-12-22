import { User, Account, Transaction } from "../types";
import { db } from "./firebaseConfig";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  doc,
} from "firebase/firestore";
const user_ref = collection(db, "Users");
const transaction_ref = collection(db, "Transactions");
const account_ref = collection(db, "Accounts");

export const StorageKeys = {
  USERS: "bank_users",
  ACCOUNTS: "bank_accounts",
  TRANSACTIONS: "bank_transactions",
  CURRENT_USER: "bank_current_user",
};

export const getUsers = async (): Promise<User[]> => {
  const all_users: User[] = [];
  const users = await getDocs(user_ref);
  users.forEach((doc) => {
    all_users.push(doc.data() as User);
  });
  return all_users;
};

export const saveUser = async (user: User) => {
  try {
    const ref = await setDoc(doc(user_ref, user.username), user);
  } catch (error) {
    return new Error("Error adding document: " + error);
  }
};
export const checkUser = async (username:string) => {
  const userRef = await getDoc(doc(db,"Users", username));
  return userRef.exists()
}
export const updateUser = async (username: string, updates: Partial<User>) => {
  const user = doc(user_ref, username);
  try {
    await updateDoc(user, updates);
  } catch (error) {
    return new Error("Error updating document: " + error);
  }
};

export const getAccounts = async (): Promise<Account[]> => {
  const all_accounts: Account[] = [];
  const accounts = await getDocs(account_ref);
  accounts.forEach((doc) => {
    all_accounts.push(doc.data() as Account);
  });
  return all_accounts;
};

export const saveAccount = async (account: Account) => {
  try {
    await setDoc(doc(account_ref, account.accountNumber), account);
  } catch (error) {
    return new Error("Error adding document: " + error);
  }
};

export const updateAccounts = async (accounts:{accountNumber:string,balance:number}[]) => {
  accounts.forEach(async (account) => {
    await updateDoc(doc(account_ref, account.accountNumber), {
      balance: account.balance,
    });
  });
};

export const getTransactions = async(): Promise<Transaction[]> => {
  const all_transactions: Transaction[] = [];
  const transactions = await getDocs(transaction_ref);
  transactions.forEach((doc) => {
    all_transactions.push(doc.data() as Transaction);
  });
  return all_transactions;
};

export const saveTransactions = async (transactions:Transaction[]) => {
  try {
    transactions.forEach(async (transaction) => {
      await setDoc(doc(transaction_ref, transaction.id), transaction);
    });
    
  }catch(error){
    return new Error("Error adding document: " + error);
  }
 
};

export const setCurrentUser = (username: string | null) => {
  if (username) {
    localStorage.setItem(StorageKeys.CURRENT_USER, username);
  } else {
    localStorage.removeItem(StorageKeys.CURRENT_USER);
  }
};

export const getCurrentUser = (): string | null => {
  return localStorage.getItem(StorageKeys.CURRENT_USER);
};
