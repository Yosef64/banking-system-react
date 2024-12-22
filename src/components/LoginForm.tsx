import React, { useState } from "react";
import { Lock, User } from "lucide-react";
import { getUsers, updateUser, setCurrentUser } from "../utils/storage";

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const users = await getUsers();
    console.log(users);
    const user = users.find((u) => u.username === username);

    if (!user) {
      setError("User not found");
      return;
    }

    if (user.isLocked) {
      const lockoutTime = 10 * 60 * 1000; // 10 minutes
      const timeRemaining = user.lastLoginAttempt! + lockoutTime - Date.now();

      if (timeRemaining > 0) {
        setError(
          `Account is locked. Try again in ${Math.ceil(
            timeRemaining / 60000
          )} minutes`
        );
        setLoading(false);
        return;
      } else {
        updateUser(username, { isLocked: false, loginAttempts: 0 });
      }
    }

    if (user.password !== password) {
      const attempts = user.loginAttempts + 1;
      if (attempts >= 3) {
        updateUser(username, {
          loginAttempts: attempts,
          isLocked: true,
          lastLoginAttempt: Date.now(),
        });
        setError("Account locked due to too many failed attempts");
      } else {
        updateUser(username, { loginAttempts: attempts });
        setError(`Invalid password. ${3 - attempts} attempts remaining`);
      }
      setLoading(false);
      return;
    }

    updateUser(username, { loginAttempts: 0, isLocked: false });
    setCurrentUser(username);
    setLoading(false);
    onSuccess();
  };

  return (
    <div className="w-full  bg-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Please sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Username"
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
              placeholder="Password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {loading ? "Loading" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
