"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import Link from "next/link";
import { Search, Bell, ChevronDown } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/60 backdrop-blur-md flex items-center justify-between px-10 shrink-0 sticky top-0 z-20 shadow-sm border-b border-gray-100">
          
          <div className="flex-1 max-w-2xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-white border border-gray-200 text-gray-700 rounded-full py-3 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 ml-8">
            <button className="relative p-2 text-gray-400 hover:text-indigo-500 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <Link 
              href="/dashboard/profile" 
              className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-full pr-4 transition-colors border border-transparent hover:border-gray-200"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dhanaseelan" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <span className="font-semibold text-gray-700 text-sm hidden sm:block">Dhanaseelan</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
