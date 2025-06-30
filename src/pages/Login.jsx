import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  loginWithEmail,
  loginWithGoogle,
  resetPassword,
} from "../../Backend/firebase/auth/auth";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import {
  FaGithub,
  FaTwitter,
  FaFacebook,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  FaShieldAlt,
  FaStar,
  FaArrowRight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCircleNotch,
} from "react-icons/fa";

const EnhancedLogin = () => {
  const navigate = useNavigate();
  const { userData } = useEnhancedAuth();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // UI state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    if (userData) {
      navigate("/dashboard");
    }
  }, [userData, navigate]);

  // Load remembered email from localStorage
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Handle account lockout
  useEffect(() => {
    if (loginAttempts >= 5) {
      setIsLocked(true);
      setLockTimer(300); // 5 minutes
    }
  }, [loginAttempts]);

  useEffect(() => {
    if (lockTimer > 0) {
      const timer = setTimeout(() => setLockTimer(lockTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isLocked) {
      setIsLocked(false);
      setLoginAttempts(0);
    }
  }, [lockTimer, isLocked]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);
    setError("");

    try {
      const user = await loginWithEmail(email, password);

      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      toast.success("Welcome back to Veiled-Verse!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err.message);
      setLoginAttempts((prev) => prev + 1);

      // Enhanced error messages
      let errorMessage = "Login failed. Please try again.";
      if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (err.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled.";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError("");

    try {
      let user;
      switch (provider) {
        case "google":
          user = await loginWithGoogle();
          break;
        default:
          throw new Error("Unsupported provider");
      }

      toast.success(`Welcome back! Logged in with ${provider}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(`${provider} login failed:`, err.message);
      setError(`${provider} login failed. Please try again.`);
      toast.error(`${provider} login failed`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setForgotLoading(true);
    try {
      await resetPassword(forgotEmail);
      toast.success("Password reset email sent! Check your inbox.");
      setShowForgotPassword(false);
      setForgotEmail("");
    } catch (err) {
      console.error("Password reset failed:", err.message);
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const socialProviders = [
    { name: "Google", icon: FcGoogle, color: "hover:bg-red-50 border-red-200" },
    {
      name: "GitHub",
      icon: FaGithub,
      color: "hover:bg-gray-50 border-gray-200",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      color: "hover:bg-blue-50 border-blue-200",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "hover:bg-blue-50 border-blue-200",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/90 backdrop-blur-lg shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4"
            >
              <FaStar className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
              Welcome Back
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Continue your storytelling journey
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Login Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("email")}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  activeTab === "email"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaEnvelope className="w-4 h-4 inline mr-2" />
                Email
              </button>
              <button
                onClick={() => setActiveTab("social")}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  activeTab === "social"
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaUser className="w-4 h-4 inline mr-2" />
                Social
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "email" && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                          disabled={isLocked}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                          disabled={isLocked}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <FaEyeSlash className="w-4 h-4" />
                          ) : (
                            <FaEye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {isLocked && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <FaExclamationTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-700">
                            Account temporarily locked. Try again in{" "}
                            {Math.floor(lockTimer / 60)}:
                            {(lockTimer % 60).toString().padStart(2, "0")}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={setRememberMe}
                          disabled={isLocked}
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm text-gray-600"
                        >
                          Remember me
                        </Label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
                        disabled={isLocked}
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      disabled={loading || isLocked}
                    >
                      {loading ? (
                        <>
                          <FaCircleNotch className="w-4 h-4 mr-2 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <FaArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}

              {activeTab === "social" && (
                <motion.div
                  key="social"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Sign in with your social account
                    </p>
                  </div>

                  <div className="space-y-3">
                    {socialProviders.map((provider, index) => {
                      const Icon = provider.icon;
                      return (
                        <motion.div
                          key={provider.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Button
                            variant="outline"
                            onClick={() =>
                              handleSocialLogin(provider.name.toLowerCase())
                            }
                            disabled={loading}
                            className={`w-full justify-start ${provider.color} transition-all duration-200`}
                          >
                            <Icon className="w-5 h-5 mr-3" />
                            Continue with {provider.name}
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="text-center">
                    <Badge variant="secondary" className="text-xs">
                      <FaShieldAlt className="w-3 h-3 mr-1" />
                      Secure social login
                    </Badge>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
                >
                  Create one now
                </Link>
              </p>
            </div>

            {/* Features Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4"
            >
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                What's waiting for you:
              </h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center">
                  <FaCheckCircle className="w-3 h-3 text-green-500 mr-2" />
                  Unlimited story reading
                </div>
                <div className="flex items-center">
                  <FaCheckCircle className="w-3 h-3 text-green-500 mr-2" />
                  Create and publish stories
                </div>
                <div className="flex items-center">
                  <FaCheckCircle className="w-3 h-3 text-green-500 mr-2" />
                  Earn from your writing
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email Address</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="you@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-600">
              We'll send you a link to reset your password.
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleForgotPassword}
                disabled={forgotLoading}
                className="flex-1"
              >
                {forgotLoading ? (
                  <>
                    <FaCircleNotch className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedLogin;
