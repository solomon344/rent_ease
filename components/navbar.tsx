"use client";
import Link from "next/link";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import {
  HomeIcon,
  MenuIcon,
  Phone,
  SearchIcon,
  XIcon,
  LayoutDashboard,
  Building2,
  Info,
  LogOut,
  User,
  ChevronDown,
  Sparkles,
  Calendar1Icon,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Logo from "./Logo";

import { Shield, FileText } from 'lucide-react';

const nav_items = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Properties", href: "/listings", icon: Building2 },
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Phone },
];

const Navbar = () => {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user menu on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* Announcement bar */}
      <div
        className="w-full flex items-center justify-between px-6"
        style={{
          background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
          minHeight: 34,
        }}
      >
        <div className="flex items-center gap-2">
          <Phone size={12} className="text-white/80" />
          <span className="text-xs text-white/90 font-medium">+220 269 4194</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-yellow-300" />
          <span className="text-xs text-white font-semibold">
            20% off your first booking — Limited time!
          </span>
        </div>
        <div className="hidden sm:block w-24" />
      </div>

      {/* Main Navbar */}
      <header
        className="sticky top-0 z-50 w-full transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(255,255,255,0.95)"
            : "rgba(255,255,255,1)",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          boxShadow: scrolled
            ? "0 4px 24px rgba(99,102,241,0.1), 0 1px 0 rgba(0,0,0,0.06)"
            : "0 1px 0 rgba(0,0,0,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 ml-4">
              {nav_items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-indigo-50 group"
                  style={{ color: "#374151" }}
                >
                  <item.icon size={15} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="group-hover:text-indigo-600 transition-colors">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Search */}
            <div className="flex-1 max-w-sm mx-4 hidden md:block">
              <Input
                placeholder="Search properties..."
                startContent={<SearchIcon size={15} className="text-gray-400" />}
                classNames={{
                  inputWrapper:
                    "bg-gray-50 border border-gray-200 hover:border-indigo-300 focus-within:border-indigo-400 transition-colors h-9",
                  input: "text-sm",
                }}
              />
            </div>

            {/* Right Section */}
            <div className="ml-auto flex items-center gap-2">
              {session?.user ? (
                <>
                  {/* Dashboard button for sellers */}
                  {/* @ts-ignore */}
                  {session?.user?.role === "seller" && (
                    <Link href="/dashboard">
                      <Button
                        size="sm"
                        startContent={<LayoutDashboard size={15} />}
                        className="hidden sm:flex text-xs font-semibold"
                        style={{
                          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                          color: "#fff",
                          boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                        }}
                      >
                        Dashboard
                      </Button>
                    </Link>
                  )}

                  {/* User Avatar Menu */}
                  <div className="relative hidden lg:block" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-gray-100"
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                      >
                        {session.user?.name?.[0]?.toUpperCase() ||
                          session.user?.email?.[0]?.toUpperCase() ||
                          "U"}
                      </div>
                      <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                        {session.user?.name?.split(" ")[0] || session.user?.email?.split("@")[0]}
                      </span>
                      <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                    </button>

                    {userMenuOpen && (
                      <div
                        className="absolute right-0 top-full mt-2 w-48 rounded-2xl overflow-hidden z-50"
                        style={{
                          background: "#fff",
                          border: "1px solid rgba(0,0,0,0.08)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                        }}
                      >
                        <div className="p-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800 truncate">{session.user?.name || "User"}</p>
                          <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            href="/bookings"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-colors"
                            style={{ color: "#374151" }}
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Calendar1Icon size={15} className="text-gray-400" /> My Bookings
                          </Link>
                          {/* @ts-ignore */}
                          {session?.user?.role === "seller" && (
                            <Link
                              href="/dashboard"
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm hover:bg-indigo-50 transition-colors"
                              style={{ color: "#6366f1" }}
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <LayoutDashboard size={15} /> Dashboard
                            </Link>
                          )}
                          <button
                            onClick={() => { setUserMenuOpen(false); signOut() }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm hover:bg-red-50 transition-colors"
                            style={{ color: "#ef4444" }}
                          >
                            <LogOut size={15} /> Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile logout */}
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => signOut()}
                    className="lg:hidden text-xs font-medium"
                    style={{ color: "#6366f1", background: "rgba(99,102,241,0.08)" }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link href="/login">
                    <Button
                      size="sm"
                      variant="bordered"
                      className="text-xs font-semibold border-gray-200 text-gray-700"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      size="sm"
                      className="text-xs font-semibold"
                      style={{
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        color: "#fff",
                        boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                      }}
                    >
                      Sign up free
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl transition-colors hover:bg-gray-100"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? (
                  <XIcon size={20} className="text-gray-700" />
                ) : (
                  <MenuIcon size={20} className="text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileOpen && (
          <div
            className="lg:hidden"
            style={{
              background: "#fff",
              borderTop: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 16px 32px rgba(0,0,0,0.1)",
            }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {/* Search on mobile */}
              <div className="mb-3">
                <Input
                  placeholder="Search properties..."
                  startContent={<SearchIcon size={15} className="text-gray-400" />}
                  classNames={{
                    inputWrapper: "bg-gray-50 border border-gray-200 h-9",
                    input: "text-sm",
                  }}
                />
              </div>

              {nav_items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon size={17} className="text-gray-400" />
                  {item.name}
                </Link>
              ))}

                {session?.user ? (
                  <>
                    <Link href="/bookings" onClick={() => setMobileOpen(false)}>
                      <Button
                        size="sm"
                        variant="flat"
                        className="w-full font-medium mb-2"
                        style={{ color: "#374151", background: "rgba(0,0,0,0.04)" }}
                        startContent={<Calendar1Icon size={15} />}
                      >
                        My Bookings
                      </Button>
                    </Link>
                    {/* @ts-ignore */}
                    {session?.user?.role === "seller" && (
                      <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                        <Button
                          size="sm"
                          startContent={<LayoutDashboard size={15} />}
                          className="w-full font-semibold"
                          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff" }}
                        >
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button
                      size="sm"
                      variant="flat"
                      className="w-full font-medium"
                      style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)" }}
                      onPress={() => { setMobileOpen(false); signOut() }}
                      startContent={<LogOut size={15} />}
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button size="sm" variant="bordered" className="w-full font-semibold border-gray-200 text-gray-700">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Button size="sm" className="w-full font-semibold" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff" }}>
                        Sign up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
       
        )}
      </header>
    </>
  );
};

export default Navbar;
