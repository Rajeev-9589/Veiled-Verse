import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { signUpWithEmail } from "../../Backend/firebase/auth/auth"; 
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [roles, setRoles] = useState(["reader"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await signUpWithEmail(email.trim(), password, "New User", roles);
      console.log("✅ Signed up:", user);
      navigate("/dashboard"); // 🔁 Redirect after signup
    } catch (error) {
      console.error("❌ Signup failed:", error.message);
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-8 border"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
          Join AnkaheeVerse
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <Label className="mb-2 block text-sm font-medium text-gray-700">
              Select your roles:
            </Label>
            <div className="flex gap-6">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={roles.includes("reader")}
                  onCheckedChange={() => handleRoleChange("reader")}
                />
                <span className="text-sm">📖 Reader</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={roles.includes("writer")}
                  onCheckedChange={() => handleRoleChange("writer")}
                />
                <span className="text-sm">✍️ Writer</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-purple-600 hover:underline">
            Log in
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
