import React, { useState } from "react";
import { UserPlus, Lock } from "lucide-react";
import { saveUser, saveAccount, checkUser } from "../utils/storage";
import { useToast } from "@/hooks/use-toast";

interface RegisterFormProps {
  onSuccess: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"savings" | "checking">(
    "savings"
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateAccountNumber = () => {
    return Math.random().toString().slice(2, 12);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const user = {
      username,
      password,
      loginAttempts: 0,
      isLocked: false,
    };

    const account = {
      accountNumber: generateAccountNumber(),
      type: accountType,
      balance: 0,
      userId: username,
    };

    try {
      const isUserRegisterd = await checkUser(username);

      if (isUserRegisterd) {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "The given user name already registered!",
        });
        return;
      }
      saveUser(user);
      saveAccount(account);
      onSuccess();
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-600 flex items-center justify-center p-4 w-full ">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md ">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600 mt-2">Join our banking family today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="relative">
            <UserPlus
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Choose Username"
              required
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Choose Password"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Account Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="savings"
                  checked={accountType === "savings"}
                  onChange={(e) => setAccountType(e.target.value as "savings")}
                  className="mr-2"
                />
                Savings
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="checking"
                  checked={accountType === "checking"}
                  onChange={(e) => setAccountType(e.target.value as "checking")}
                  className="mr-2"
                />
                Checking
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`w-full ${
              !loading
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-blue-200 text-black"
            }  py-3 rounded-lg transition duration-300`}
          >
            {loading ? "Creating ..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
