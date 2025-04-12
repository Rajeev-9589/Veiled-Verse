import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { loginWithEmail, loginWithGoogle } from "../../Backend/firebase/auth/auth"; // update path if needed
import { FcGoogle } from "react-icons/fc"; // Google icon

const Login = () => {
  const navigate = useNavigate(); // ✅ Hook to redirect
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await loginWithEmail(email, password);
      console.log("✅ Email Login successful:", user);
      navigate("/dashboard"); // ✅ Redirect on success
    } catch (err) {
      console.error("❌ Login failed:", err.message);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const user = await loginWithGoogle();
      navigate("/dashboard"); // ✅ Redirect on success
      console.log("✅ Google Login successful:", user);
    } catch (err) {
      console.error("❌ Google Login failed:", err.message);
      setError("Google login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-8 border"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
          Welcome Back to AnkaheeVerse
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <div className="my-4 text-center text-gray-500">or</div>

        {/* Google Login */}
        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2"
        >
          <FcGoogle size={22} />
          Continue with Google
        </Button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-purple-600 hover:underline">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
