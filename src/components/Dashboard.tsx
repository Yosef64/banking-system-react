import React, { useState, useEffect } from "react";
import {
  LogOut,
  DollarSign,
  History,
  PlusCircle,
  MinusCircle,
  ArrowRightLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  getAccounts,
  getTransactions,
  saveTransactions,
  setCurrentUser,
  updateAccounts,
} from "../utils/storage";
import { findUserAccounts, updateAccountBalance } from "../utils/accountUtils";
import type { Account, Transaction } from "../types";
import TransferForm from "./TransferForm";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

export default function Dashboard({ username, onLogout }: DashboardProps) {
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    "balance" | "transactions" | "transfer"
  >("balance");

  useEffect(() => {
    const fetchAccounts = async () => {
      const userAccounts = await findUserAccounts(username);
      const transactions = await getTransactions();
      console.log(userAccounts);
      setAccount(userAccounts[0]);
      setTransactions(
        transactions.filter(
          (t) => t.accountNumber === userAccounts[0]?.accountNumber
        )
      );
    };

    fetchAccounts();
  }, []);

  const handleTransaction = (type: "deposit" | "withdrawal") => {
    if (!account) return;

    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (type === "withdrawal" && value > account.balance) {
      setError("Insufficient funds");
      return;
    }

    const newBalance =
      type === "deposit" ? account.balance + value : account.balance - value;
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      accountNumber: account.accountNumber,
      type,
      amount: value,
      timestamp: Date.now(),
      balance: newBalance,
    };

    try {
      // Update account balance

      updateAccounts([
        { accountNumber: account.accountNumber, balance: newBalance },
      ]);
      saveTransactions([newTransaction]);

      // Update local state
      setAccount({ ...account, balance: newBalance });
      setTransactions([newTransaction, ...transactions]);
      toast({
        variant: "success",
        description:
          type == "deposit"
            ? `${value} birr deposited successfully`
            : `${value} birr withdrawn successfully`,
        title:"Success!! 🎉🎉"
      });
      setAmount("");
      setError("");
    } catch (err) {
      setError("Transaction failed. Please try again.");
    }
  };

  const handleTransferComplete = async () => {
    if (account) {
      const updatedAccount = await getAccounts().then((accounts) =>
        accounts.find((acc) => acc.accountNumber === account.accountNumber)
      );
      const updatedTransactions = await getTransactions().then((transactions) =>
        transactions.filter((t) => t.accountNumber === account.accountNumber)
      );
      if (updatedAccount) {
        setAccount(updatedAccount);
        setTransactions(updatedTransactions);
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    onLogout();
  };

  if (!account) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <DollarSign className="text-blue-600" size={24} />
              <span className="ml-2 text-xl font-semibold">ETH Bank</span>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-600">Welcome, {username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut size={20} className="mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("balance")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === "balance"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Balance & Transactions
                </button>
                <button
                  onClick={() => setActiveTab("transfer")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === "transfer"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Transfer
                </button>
                <button
                  onClick={() => setActiveTab("transactions")}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === "transactions"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Transaction History
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "balance" && (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Current Balance
                    </h2>
                    <p className="text-4xl font-bold text-blue-600 mt-2">
                      ETB {account.balance.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Account: {account.accountNumber} ({account.type})
                    </p>
                  </div>

                  <div className="max-w-md mx-auto">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Amount
                      </label>
                      {/* <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter amount"
                        min="0"
                        step="0.01"
                      /> */}
                      <Input
                        placeholder="Amount"
                        type="number"
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>

                    {error && (
                      <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleTransaction("deposit")}
                        className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                      >
                        <PlusCircle size={20} className="mr-2" />
                        Deposit
                      </button>
                      <button
                        onClick={() => handleTransaction("withdrawal")}
                        className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                      >
                        <MinusCircle size={20} className="mr-2" />
                        Withdraw
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "transfer" && (
                <div className="max-w-md mx-auto">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                    Transfer Funds
                  </h2>
                  <TransferForm
                    account={account}
                    onTransferComplete={handleTransferComplete}
                  />
                </div>
              )}

              {activeTab === "transactions" && (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Transaction History
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Balance
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(transaction.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  transaction.type === "deposit" ||
                                  transaction.type === "transfer-in"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {transaction.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ETB {transaction.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ETB {transaction.balance.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.relatedAccountNumber && (
                                <span>
                                  Account: {transaction.relatedAccountNumber}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
