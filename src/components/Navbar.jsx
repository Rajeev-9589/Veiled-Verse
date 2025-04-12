import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import logo from "../assets/ankaheeverse.png";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logout } from "../../Backend/firebase/auth/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Write", path: "/write" },
    { name: "Marketplace", path: "/marketplace" },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 z-50 ">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <Link
  to="/"
  className="flex items-center gap-2 font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent transition duration-300 hover:brightness-110"
>
  <img
    src={logo}
    alt="logo"
    className="h-9 w-9 rounded-full shadow-md ring-2 ring-purple-300 hover:ring-pink-400 transition-all duration-300"
  />
  <div className="flex flex-col leading-tight">
    <span className="text-xl sm:text-2xl flex items-baseline">
    Veiled Verse
    </span>
    
  </div>
  
</Link>


        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-700 hover:text-purple-600 font-medium transition"
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 mt-2">
                <DropdownMenuItem onClick={goToDashboard}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button className="ml-2">Login</Button>
            </Link>
          )}

          <Link to="/subscribe">
            <Button className="ml-2">Subscribe</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <div className="flex flex-col px-4 py-3 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-purple-600 font-medium"
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <>
                <Button onClick={() => { navigate("/dashboard"); setIsOpen(false); }} className="w-full mt-2">
                  Dashboard
                </Button>
                <Button onClick={handleLogout} className="w-full mt-2">
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button className="w-full mt-2">Login</Button>
              </Link>
            )}

            <Link to="/subscribe">
              <Button className="w-full mt-2">Subscribe</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
