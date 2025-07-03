import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  User, 
  BookOpen, 
  PenTool, 
  ShoppingBag, 
  Home,
  Sparkles,
  Crown,
  LogOut,
  Settings,
  BarChart3,
  Zap
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/ankaheeverse.png";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userData, logout, hasPermission } = useEnhancedAuth();

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Write", path: "/write", icon: PenTool },
    { name: "Explorer", path: "/explorer/book", icon: ShoppingBag },
    { name: "Marketplace", path: "/marketplace", icon: ShoppingBag },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <>
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`w-full fixed top-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              className="flex items-center gap-3 font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent transition duration-300 hover:brightness-110"
            >
              <div className="relative">
                <img
                  src={logo}
                  alt="logo"
                  className="h-10 w-10 rounded-full shadow-lg ring-2 ring-purple-300 hover:ring-pink-400 transition-all duration-300"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-80"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xl sm:text-2xl flex items-baseline">
                  Veiled Verse
                  <Sparkles className="w-5 h-5 ml-1 text-purple-500" />
                </span>
                <span className="text-xs text-gray-500 font-normal">Storytelling Platform</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <motion.div
                  key={link.name}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-purple-600 bg-purple-50 border border-purple-200'
                        : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                </motion.div>
              );
            })}

            {hasPermission && hasPermission('admin') && (
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    location.pathname === '/admin'
                      ? 'text-purple-600 bg-purple-50 border border-purple-200'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Admin Panel
                </Link>
              </motion.div>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 overflow-hidden">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={userData?.displayName || 'User'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-purple-600" />
                      )}
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-xl">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userData?.displayName || 'User'}</p>
                    <p className="text-xs text-gray-500">{userData?.email}</p>
                  </div>
                  
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="flex items-center gap-2 cursor-pointer">
                    <BookOpen className="w-4 h-4" />
                    Dashboard
                  </DropdownMenuItem>
                  
                  {hasPermission('write') && (
                    <DropdownMenuItem onClick={() => navigate("/write")} className="flex items-center gap-2 cursor-pointer">
                      <Zap className="w-4 h-4" />
                     Write a story
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium">
                    Login
                  </Button>
                </Link>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/subscribe">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Subscribe
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200"
              >
                {isOpen ? <X size={20} className="text-purple-600" /> : <Menu size={20} className="text-purple-600" />}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200/50 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.name}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-purple-600 bg-purple-50 border border-purple-200'
                          : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}

              {hasPermission && hasPermission('admin') && (
                <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => { navigate("/admin"); setIsOpen(false); }} 
                    className="w-full mt-3 bg-gradient-to-r from-gray-800 to-purple-800 hover:from-gray-900 hover:to-purple-900 text-white font-medium flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Admin Panel
                  </Button>
                </motion.div>
              )}

              <div className="border-t border-gray-200 pt-3 mt-2">
                {user ? (
                  <>
                    <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={() => { navigate("/dashboard"); setIsOpen(false); }} 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        Dashboard
                      </Button>
                    </motion.div>
                    
                    {hasPermission('write') && (
                      <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          onClick={() => { navigate("/enhanced-write"); setIsOpen(false); }} 
                          className="w-full mt-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium flex items-center gap-2"
                        >
                          <Zap className="w-4 h-4" />
                          Enhanced Write
                        </Button>
                      </motion.div>
                    )}
                    
                    <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={() => { navigate("/enhanced-dashboard"); setIsOpen(false); }} 
                        className="w-full mt-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium flex items-center gap-2"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Analytics
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={handleLogout} 
                        className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white font-medium flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/login">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium">
                        Login
                      </Button>
                    </Link>
                  </motion.div>
                )}

                <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/subscribe">
                    <Button className="w-full mt-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Subscribe
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
    <div className="w-full bg-yellow-100 border-b border-yellow-300 text-yellow-900 text-sm sm:text-base px-4 py-2 text-center font-medium shadow-md z-30">
  ⏳ <span className="font-semibold">Note:</span> Publishing requires a short approval time (approx. 1 hour) for content review to ensure no vulgarities are published. 🛡️ Buying is currently in <span className="underline decoration-dotted decoration-yellow-600">demo mode</span> — feel free to login, explore and hit <strong>Buy</strong>! 🛒✨ <span className="block sm:inline mt-1 sm:mt-0">— <span className="italic text-yellow-800">crafted by Rajeev</span> ❤️</span>
</div>

  </>
  );
};

export default Navbar;
