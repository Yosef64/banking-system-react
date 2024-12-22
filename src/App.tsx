import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";
import { getCurrentUser, StorageKeys } from "./utils/storage";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const [view, setView] = useState<"login" | "register" | "dashboard">("login");
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setView("dashboard");
    }
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setView("login");
  };

  return (
    <div className=" min-h-screen bg-blue-600">
      <Toaster />

      {view === "login" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            height: "100vh",
          }}
        >
          <LoginForm
            onSuccess={() => {
              setCurrentUser(getCurrentUser());
              setView("dashboard");
            }}
          />
          <div className="text-center mt-4">
            <button
              onClick={() => setView("register")}
              className="text-white hover:text-blue-900"
            >
              Don't have an account? Register here
            </button>
          </div>
        </div>
      )}

      {view === "register" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            height: "100vh",
          }}
        >
          <RegisterForm onSuccess={() => setView("login")} />
          <div className="text-center mt-4">
            <button
              onClick={() => setView("login")}
              className="text-white hover:text-blue-800"
            >
              Already have an account? Login here
            </button>
          </div>
        </div>
      )}

      {view === "dashboard" && currentUser && (
        <Dashboard username={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
