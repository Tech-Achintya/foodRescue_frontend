import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import MessDashboard from "./pages/MessDashboard";
import NGODashboard from "./pages/NGODashboard";

export default function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on refresh
  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  try {
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  } catch (err) {
    console.error("Failed to parse stored user:", err);
    localStorage.removeItem("user"); // clean up corrupted data
  }
}, []);


  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route
          path="/"
          element={
            user ? (
              user.role === "MESS" ? (
                <Navigate to="/mess" />
              ) : (
                <Navigate to="/ngo" />
              )
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* Mess Dashboard */}
        <Route
          path="/mess"
          element={
            user && user.role === "MESS" ? (
              <MessDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* NGO Dashboard */}
        <Route
          path="/ngo"
          element={
            user && user.role === "NGO" ? (
              <NGODashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Any other route → go home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
