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
  signUpWithEmail,
  loginWithGoogle,
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
  FaBookOpen,
  FaPenFancy,
  FaCrown,
  FaUsers,
  FaHeart,
  FaGift,
} from "react-icons/fa";

const EnhancedSignupPage = () => {
  const navigate = useNavigate();
  const { userData } = useEnhancedAuth();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [roles, setRoles] = useState(["reader"]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // UI state
  const [activeTab, setActiveTab] = useState("email");
  const [step, setStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Redirect if already logged in
  useEffect(() => {
    if (userData) {
      navigate("/dashboard");
    }
  }, [userData, navigate]);

  // Password strength checker
  useEffect(() => {
    const { password } = formData;
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setPasswordRequirements(requirements);

    const strength = Object.values(requirements).filter(Boolean).length;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleRoleChange = (role) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required");
      return false;
    }

    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (passwordStrength < 3) {
      setError("Password is too weak. Please make it stronger");
      return false;
    }

    if (!acceptedTerms) {
      setError("Please accept the terms and conditions");
      return false;
    }

    if (roles.length === 0) {
      setError("Please select at least one role");
      return false;
    }

    return true;
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const user = await signUpWithEmail(
        formData.email.trim(),
        formData.password,
        fullName,
        roles,
      );

      toast.success(
        "Welcome to Veiled-Verse! Your account has been created successfully.",
      );
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup failed:", err.message);
      let errorMessage = "Failed to create account. Please try again.";

      if (err.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists.";
      } else if (err.code === "auth/weak-password") {
        errorMessage =
          "Password is too weak. Please choose a stronger password.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = async (provider) => {
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

      toast.success(
        `Welcome to Veiled-Verse! Account created with ${provider}`,
      );
      navigate("/dashboard");
    } catch (err) {
      console.error(`${provider} signup failed:`, err.message);
      setError(`${provider} signup failed. Please try again.`);
      toast.error(`${provider} signup failed`);
    } finally {
      setLoading(false);
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

  const roleOptions = [
    {
      id: "reader",
      title: "Reader",
      icon: FaBookOpen,
      description: "Read and discover amazing stories",
      benefits: [
        "Unlimited story reading",
        "Bookmark favorites",
        "Rate and review",
      ],
    },
    {
      id: "writer",
      title: "Writer",
      icon: FaPenFancy,
      description: "Create and publish your own stories",
      benefits: [
        "Publish unlimited stories",
        "Earn from your writing",
        "Analytics dashboard",
      ],
    },
  ];

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    if (passwordStrength <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Fair";
    if (passwordStrength <= 4) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
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
              Join Veiled-Verse
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Start your storytelling journey today
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Signup Tabs */}
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
                  <form onSubmit={handleEmailSignup} className="space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="text-sm font-medium"
                        >
                          First Name
                        </Label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="text-sm font-medium"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
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
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
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
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className="pl-10 pr-10"
                          required
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

                      {/* Password Strength */}
                      {formData.password && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Password strength:</span>
                            <span
                              className={`font-medium ${getPasswordStrengthColor().replace("bg-", "text-")}`}
                            >
                              {getPasswordStrengthText()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                              style={{
                                width: `${(passwordStrength / 5) * 100}%`,
                              }}
                            ></div>
                          </div>

                          {/* Password Requirements */}
                          <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                            <div
                              className={`flex items-center ${passwordRequirements.length ? "text-green-600" : ""}`}
                            >
                              <FaCheckCircle
                                className={`w-3 h-3 mr-1 ${passwordRequirements.length ? "text-green-500" : "text-gray-400"}`}
                              />
                              At least 8 characters
                            </div>
                            <div
                              className={`flex items-center ${passwordRequirements.uppercase ? "text-green-600" : ""}`}
                            >
                              <FaCheckCircle
                                className={`w-3 h-3 mr-1 ${passwordRequirements.uppercase ? "text-green-500" : "text-gray-400"}`}
                              />
                              One uppercase letter
                            </div>
                            <div
                              className={`flex items-center ${passwordRequirements.lowercase ? "text-green-600" : ""}`}
                            >
                              <FaCheckCircle
                                className={`w-3 h-3 mr-1 ${passwordRequirements.lowercase ? "text-green-500" : "text-gray-400"}`}
                              />
                              One lowercase letter
                            </div>
                            <div
                              className={`flex items-center ${passwordRequirements.number ? "text-green-600" : ""}`}
                            >
                              <FaCheckCircle
                                className={`w-3 h-3 mr-1 ${passwordRequirements.number ? "text-green-500" : "text-gray-400"}`}
                              />
                              One number
                            </div>
                            <div
                              className={`flex items-center ${passwordRequirements.special ? "text-green-600" : ""}`}
                            >
                              <FaCheckCircle
                                className={`w-3 h-3 mr-1 ${passwordRequirements.special ? "text-green-500" : "text-gray-400"}`}
                              />
                              One special character
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <FaEyeSlash className="w-4 h-4" />
                          ) : (
                            <FaEye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {formData.confirmPassword &&
                        formData.password !== formData.confirmPassword && (
                          <p className="text-xs text-red-500">
                            Passwords do not match
                          </p>
                        )}
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">
                        Choose your role(s):
                      </Label>
                      <div className="grid gap-3">
                        {roleOptions.map((role) => {
                          const Icon = role.icon;
                          return (
                            <div
                            key={role.id}
                            className={`p-4 border-2 rounded-lg transition-all ${
                              roles.includes(role.id)
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <Checkbox
                                checked={!!roles.includes(role.id)}
                                onCheckedChange={(checked) => {
                                  if (typeof checked !== "boolean") return;
                          
                                  setRoles((prev) => {
                                    if (checked && !prev.includes(role.id)) {
                                      return [...prev, role.id];
                                    } else if (!checked && prev.includes(role.id)) {
                                      return prev.filter((r) => r !== role.id);
                                    }
                                    return prev;
                                  });
                                }}
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <Icon className="w-5 h-5 text-purple-600" />
                                  <h3 className="font-medium text-gray-900">{role.title}</h3>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                                <div className="mt-2 space-y-1">
                                  {role.benefits.map((benefit, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center text-xs text-gray-500"
                                    >
                                      <FaCheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                      {benefit}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          );
                        })}
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptedTerms}
                        onCheckedChange={setAcceptedTerms}
                      />
                      <div className="text-sm text-gray-600">
                        <label htmlFor="terms" className="cursor-pointer">
                          I agree to the{" "}
                          <button
                            type="button"
                            onClick={() => setShowTerms(true)}
                            className="text-purple-600 hover:text-purple-700 underline"
                          >
                            Terms and Conditions
                          </button>{" "}
                          and{" "}
                          <button
                            type="button"
                            onClick={() => setShowTerms(true)}
                            className="text-purple-600 hover:text-purple-700 underline"
                          >
                            Privacy Policy
                          </button>
                        </label>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <FaExclamationTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-700">{error}</span>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <FaCircleNotch className="w-4 h-4 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
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
                      Sign up with your social account
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
                              handleSocialSignup(provider.name.toLowerCase())
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
                      Secure social signup
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

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Welcome Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4"
            >
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <FaGift className="w-4 h-4 text-purple-500 mr-2" />
                Welcome to Veiled-Verse!
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-center">
                  <FaUsers className="w-3 h-3 text-blue-500 mr-2" />
                  Join our community of storytellers
                </div>
                <div className="flex items-center">
                  <FaHeart className="w-3 h-3 text-red-500 mr-2" />
                  Discover amazing stories
                </div>
                <div className="flex items-center">
                  <FaCrown className="w-3 h-3 text-yellow-500 mr-2" />
                  Earn from your creativity
                </div>
                <div className="flex items-center">
                  <FaShieldAlt className="w-3 h-3 text-green-500 mr-2" />
                  Secure and private platform
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Terms and Conditions Dialog */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              Welcome to Veiled-Verse! By creating an account, you agree to the
              following terms:
            </p>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900">
                  1. Account Creation
                </h4>
                <p>
                  You must provide accurate information when creating your
                  account.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  2. Content Guidelines
                </h4>
                <p>
                  All content must be original and comply with our community
                  guidelines.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">3. Privacy</h4>
                <p>
                  We respect your privacy and will protect your personal
                  information.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">4. Monetization</h4>
                <p>
                  Writers can earn from their stories through our platform's
                  monetization features.
                </p>
              </div>
            </div>
            <Button onClick={() => setShowTerms(false)} className="w-full">
              I Understand
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedSignupPage;
