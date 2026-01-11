"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { LuMoon } from "react-icons/lu";
import { GoSun } from "react-icons/go";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { IoIosArrowDropright } from "react-icons/io";
import { FiUser, FiLogOut, FiGrid } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "@/app/context/ThemeProvider";
import Cookies from "js-cookie";
import { toast } from "sonner";

const BASE_URL = "https://amused-celinka-nothingname-3b1ecdef.koyeb.app/api/v1";

import "./styles/navbar.css";

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  role: "user" | "admin" | "career_coach" | "recruiter" | "job_seeker" | "employer" | "csr" | "sales" | "student";
  avatar?: string;
  profilePictureUrl?: string;
}

// Role to dashboard route mapping
const DASHBOARD_ROUTES: Record<string, string> = {
  admin: "/admin",
  user: "/user",
  career_coach: "/coach",
  recruiter: "/recruiter",
  job_seeker: "/user",
  employer: "/employer",
  csr: "/csr",
  sales: "/sales",
  student: "/user",
};

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sections = [
    { name: "Jobs", link: "/jobs" },
    { name: "Analyse-Cv", link: "/analyse-cv" },
    { name: "About", link: "/about" },
    { name: "Services", link: "/services" },
    { name: "Contact", link: "/contact" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const accessToken = Cookies.get("accessToken");

      if (!accessToken) {
        setIsLoading(false);
        setUser(null);
        return;
      }

      const response = await fetch(`${BASE_URL}/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        // Check if we got valid user data
        if (data && (data.user || data._id)) {
          setUser(data.user || data);
        } else {
          setUser(null);
          Cookies.remove("accessToken");
        }
      } else {
        // Token invalid or expired
        setUser(null);
        if (response.status === 401) {
          Cookies.remove("accessToken");
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  // Verify user and navigate to correct dashboard
  const handleDashboardClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    setShowDropdown(false);

    try {
      const accessToken = Cookies.get("accessToken");

      if (!accessToken) {
        toast.error("Please login to access dashboard");
        router.push("/login");
        return;
      }

      // Verify token and get current user data
      const response = await fetch(`${BASE_URL}/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        // Token invalid or expired
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setUser(null);
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const data = await response.json();
      const verifiedUser = data.user || data;

      // Verify user ID matches (extra security check)
      if (user && verifiedUser._id !== user._id) {
        console.error("User mismatch detected");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setUser(null);
        toast.error("Session invalid. Please login again.");
        router.push("/login");
        return;
      }

      // Update user state with fresh data
      setUser(verifiedUser);

      // Get dashboard route based on role
      const userRole = verifiedUser.role || "user";
      const dashboardRoute = DASHBOARD_ROUTES[userRole] || "/user";

      console.log(`Navigating to ${dashboardRoute} for role: ${userRole}`);
      
      // Navigate to role-specific dashboard
      router.push(dashboardRoute);

    } catch (error) {
      console.error("Dashboard navigation error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsNavigating(false);
    }
  };

  const handleLogout = async () => {
    try {
      const accessToken = Cookies.get("accessToken");

      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setUser(null);
      setShowDropdown(false);
      toast.success("Logged out successfully");
      router.push("/");
    }
  };

  // Get dashboard label based on role
  const getDashboardLabel = () => {
    if (!user) return "Dashboard";
    
    const labels: Record<string, string> = {
      admin: "Admin Dashboard",
      user: "My Dashboard",
      career_coach: "Coach Dashboard",
      recruiter: "Recruiter Dashboard",
      job_seeker: "My Dashboard",
      employer: "Employer Dashboard",
      csr: "CSR Dashboard",
      sales: "Sales Dashboard",
      student: "My Dashboard",
    };
    
    return labels[user.role] || "Dashboard";
  };

  const getUserInitials = () => {
    if (!user) return "U";
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.fullName) {
      const parts = user.fullName.split(" ");
      return parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : parts[0][0].toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  const getUserAvatar = () => {
    return user?.avatar || user?.profilePictureUrl || null;
  };

  // Get role badge color
  const getRoleBadgeColor = () => {
    if (!user) return "bg-gray-100 text-gray-700";
    
    const colors: Record<string, string> = {
      admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      user: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
      career_coach: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      recruiter: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      job_seeker: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
      employer: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      csr: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
      sales: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      student: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    };
    
    return colors[user.role] || colors.user;
  };

  // Format role for display
  const formatRole = (role: string) => {
    const roleNames: Record<string, string> = {
      admin: "Admin",
      user: "User",
      career_coach: "Career Coach",
      recruiter: "Recruiter",
      job_seeker: "Job Seeker",
      employer: "Employer",
      csr: "Customer Support",
      sales: "Sales",
      student: "Student",
    };
    return roleNames[role] || role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, " ");
  };

  return (
    <div>
      {/* Desktop Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 py-3 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Glass morphism container */}
          <div
            className="
              backdrop-blur-md 
              bg-white/70 
              dark:bg-gray-900/70
              border border-gray-200/50 
              dark:border-gray-700/50
              shadow-lg 
              shadow-gray-200/20
              dark:shadow-gray-900/30
              rounded-full 
              px-6 
              py-3
              flex 
              items-center 
              justify-between
            "
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center shadow-md">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="font-semibold text-gray-800 dark:text-white text-lg">
                CV Saathi
              </span>
            </Link>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {sections.map((section) => (
                <Link
                  key={section.name}
                  href={section.link}
                  className="text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium text-sm"
                >
                  {section.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors">
                <CiSearch size={20} />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors"
              >
                {theme === "light" ? (
                  <LuMoon size={18} />
                ) : (
                  <GoSun size={18} />
                )}
              </button>

              {/* Auth Section */}
              {isLoading ? (
                <div className="w-20 h-9 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              ) : user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {getUserAvatar() ? (
                      <img
                        src={getUserAvatar()!}
                        alt={user.fullName || user.email}
                        className="w-8 h-8 rounded-full object-cover border-2 border-cyan-400"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white text-sm font-semibold">
                        {getUserInitials()}
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                            {user.fullName ||
                              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                              "User"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getRoleBadgeColor()}`}
                          >
                            {formatRole(user.role)}
                          </span>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          {/* Dashboard Button - Verifies and redirects based on role */}
                          <button
                            onClick={handleDashboardClick}
                            disabled={isNavigating}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
                          >
                            {isNavigating ? (
                              <svg
                                className="animate-spin w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                            ) : (
                              <FiGrid size={16} />
                            )}
                            <span>{isNavigating ? "Verifying..." : getDashboardLabel()}</span>
                          </button>

                          <Link
                            href="/user/settings"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <FiUser size={16} />
                            <span>Profile</span>
                          </Link>

                          <hr className="my-2 border-gray-100 dark:border-gray-700" />

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <FiLogOut size={16} />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="
                    bg-gradient-to-r from-cyan-400 to-cyan-500 
                    hover:from-cyan-500 hover:to-cyan-600
                    text-white 
                    px-5 py-2 
                    rounded-full 
                    text-sm 
                    font-medium 
                    shadow-md 
                    hover:shadow-lg 
                    transition-all
                    whitespace-nowrap
                  "
                >
                  Get Started
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-gray-600 dark:text-gray-300"
                onClick={handleClick}
              >
                <RxHamburgerMenu size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={handleClick}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative h-full w-[75%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={handleClick}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <RxCross2 size={24} />
              </button>

              {/* Logo */}
              <div className="px-6 pt-6 pb-8 border-b border-gray-100 dark:border-gray-800">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={handleClick}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-white text-xl">
                    CV Saathi
                  </span>
                </Link>
              </div>

              {/* User Info (if logged in) */}
              {user && (
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    {getUserAvatar() ? (
                      <img
                        src={getUserAvatar()!}
                        alt={user.fullName || user.email}
                        className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white text-lg font-semibold">
                        {getUserInitials()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {user.fullName ||
                          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                          "User"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                        {user.email}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getRoleBadgeColor()}`}
                      >
                        {formatRole(user.role)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="px-4 py-6">
                <div className="space-y-2">
                  {sections.map((section) => (
                    <Link
                      key={section.name}
                      href={section.link}
                      onClick={handleClick}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
                    >
                      <IoIosArrowDropright
                        size={20}
                        className="text-cyan-500"
                      />
                      <span className="font-medium">{section.name}</span>
                    </Link>
                  ))}

                  {/* Dashboard link for logged in users */}
                  {user && (
                    <button
                      onClick={(e) => {
                        handleDashboardClick(e);
                        handleClick();
                      }}
                      disabled={isNavigating}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {isNavigating ? (
                        <svg
                          className="animate-spin w-5 h-5 text-cyan-500"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        <FiGrid size={20} className="text-cyan-500" />
                      )}
                      <span className="font-medium">
                        {isNavigating ? "Verifying..." : getDashboardLabel()}
                      </span>
                    </button>
                  )}
                </div>
              </nav>

              {/* Bottom Actions */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 dark:border-gray-800">
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      handleClick();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <FiLogOut size={18} />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={handleClick}
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white rounded-xl font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-lg"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20" />
    </div>
  );
};

export default Navbar;