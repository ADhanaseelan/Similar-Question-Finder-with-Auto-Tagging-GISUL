"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import Link from "next/link";
import { Search, Bell, ChevronDown, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("http://localhost:8000/api/users/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserName(data.displayName || data.email.split('@')[0]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/60 backdrop-blur-md flex items-center justify-between px-4 md:px-10 shrink-0 sticky top-0 z-20 shadow-sm border-b border-gray-100 dark:bg-gray-900/60 dark:border-gray-800">
          
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 max-w-2xl ml-2 md:ml-0">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-full py-3 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6 ml-4 md:ml-8">
            <button className="relative p-2 text-gray-400 hover:text-indigo-500 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <Link 
              href="/dashboard/profile" 
              className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 rounded-full pr-4 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                {userName ? (
                  <span className="text-indigo-600 font-bold text-lg">{userName.charAt(0).toUpperCase()}</span>
                ) : (
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dhanaseelan" alt="Profile" className="w-full h-full object-cover" />
                )}
              </div>
              <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm hidden sm:block">{userName || "Loading..."}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-10 overflow-y-auto overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
