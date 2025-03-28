import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Auth = ({ isSignup }) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const API_BASE_URL = "https://zidio-task-management-api.vercel.app";
      const endpoint = isSignup ? `${API_BASE_URL}/api/auth/signup` : `${API_BASE_URL}/api/auth/login`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("API Response:", data); // ✅ Debugging Log

      if (!response.ok) throw new Error(data.message || "Something went wrong!");

      if (!isSignup) {
        login(data);  // ✅ This should update user context
        console.log("User logged in:", data); // ✅ Debugging Log
        navigate("/home"); // ✅ Redirect
      } else {
        navigate("/login");
      }
    } catch (error) {
      setError(error.message);
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg mx-12">
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
          {isSignup ? "Sign Up" : "Login"}
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              name="username"
              placeholder="Full Name"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => navigate(isSignup ? "/" : "/signup")}
            className="text-blue-500"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;