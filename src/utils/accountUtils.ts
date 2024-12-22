import { Account } from "../types";
import { getAccounts } from "./storage";

export const findAccountByNumber = async (
  accountNumber: string
): Promise<Account | undefined> => {
  const account = await getAccounts().then((accounts) =>
    accounts.find((acc) => acc.accountNumber === accountNumber)
  );
  return account;
};

export const findUserAccounts = async (userId: string): Promise<Account[]> => {
  const accounts = await getAccounts().then((accounts) =>
    accounts.filter((acc) => acc.userId === userId)
  );
  return accounts;
};

export const updateAccountBalance = (
  accounts: Account[],
  accountNumber: string,
  newBalance: number
): Account[] => {
  return accounts.map((acc) =>
    acc.accountNumber === accountNumber ? { ...acc, balance: newBalance } : acc
  );
};
