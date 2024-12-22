import React, { useState, useEffect } from "react";
import { ArrowRightLeft } from "lucide-react";
import { Account, Transaction } from "../types";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import {
  getAccounts,
  getTransactions,
  updateAccounts,
  saveTransactions,
} from "../utils/storage";
import { updateAccountBalance } from "../utils/accountUtils";
import { BankUser } from "./shadcnComps";

interface TransferFormProps {
  account: Account;
  onTransferComplete: () => void;
}

export default function TransferForm({
  account,
  onTransferComplete,
}: TransferFormProps) {
  const [amount, setAmount] = useState("");
  const [targetAccount, setTargetAccount] = useState("");
  const [error, setError] = useState("");
  const [otherAccounts, setOtherAccounts] = useState<Account[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAccounts = async () => {
      const accounts = await getAccounts();
      const filteredAccounts = accounts.filter(
        (acc) => acc.accountNumber !== account.accountNumber
      );
      setOtherAccounts(filteredAccounts);
    };
    fetchAccounts();
  }, []);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);

    if (isNaN(value) || value <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (value > account.balance) {
      setError("Insufficient funds");
      return;
    }

    const target = otherAccounts.find(
      (acc) => acc.accountNumber === targetAccount
    );
    if (!target) {
      setError("Invalid target account");
      return;
    }

    try {
      const timestamp = Date.now();
      const transferOutTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        accountNumber: account.accountNumber,
        type: "transfer-out",
        amount: value,
        timestamp,
        balance: account.balance - value,
        relatedAccountNumber: target.accountNumber,
      };

      const transferInTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        accountNumber: target.accountNumber,
        type: "transfer-in",
        amount: value,
        timestamp,
        balance: target.balance + value,
        relatedAccountNumber: account.accountNumber,
      };

      // Save changes
      updateAccounts([
        {
          accountNumber: account.accountNumber,
          balance: account.balance - value,
        },
        {
          accountNumber: target.accountNumber,
          balance: target.balance + value,
        },
      ]);
      saveTransactions([transferOutTransaction, transferInTransaction]);

      setAmount("");
      setTargetAccount("");
      setError("");
      toast({
        variant: "success",
        title: "Successfully Sent!",
        description: `Account Number : ${targetAccount}`,
      });
      onTransferComplete();
    } catch (err) {
      setError("Transfer failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleTransfer} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Transfer Amount
        </label>
        <div className="mt-1 ">
          <Input
            type="number"
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          {/* <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter amount"
            min="0"
            step="0.01"
            required
          /> */}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          To Account
        </label>
        {/* <select
          value={targetAccount}
          onChange={(e) => setTargetAccount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select account</option>
          {otherAccounts.map((acc) => (
            <option key={acc.accountNumber} value={acc.accountNumber}>
              {acc.accountNumber} ({acc.type}) - {acc.userId}
            </option>
          ))}
        </select> */}
        <BankUser
          setTargetAccount={setTargetAccount}
          accounts={otherAccounts}
          target={targetAccount}
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        <ArrowRightLeft size={20} className="mr-2" />
        Transfer Funds
      </button>
    </form>
  );
}
