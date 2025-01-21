import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/login", {
        email,
        password,
      });

      const { token } = response.data;

      // Save the token in cookies
      Cookies.set("token", token, { expires: 1 }); // 1-day expiration

      // Redirect to dashboard or home page
      navigate("/dashboard");

      console.log("Login successful:");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to login. Please try again.",
      );
      console.error("Login error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {errorMessage && (
          <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 text-black font-semibold rounded ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-accent hover:bg-indigo-600"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          Dont have an account?{" "}
          <a href="/register" className="text-indigo-500 hover:underline">
            Register here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
