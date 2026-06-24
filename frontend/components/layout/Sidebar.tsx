"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  MessageSquarePlus,
  History,
  BookOpen,
  Brain,
  Copy,
  PieChart,
  Search,
  Bookmark,
  Activity,
  BarChart,
  Settings,
  User,
  LogOut,
  Network,
  X
} from "lucide-react";

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Questions", href: "/dashboard/questions", icon: MessageSquare },
    { name: "Ask Question", href: "/dashboard/ask-question", icon: MessageSquarePlus },
    { name: "Topics", href: "/dashboard/topics", icon: BookOpen },
    { name: "Bloom's Quiz", href: "/dashboard/blooms-quiz", icon: Brain },
    { name: "Question History", href: "/dashboard/history", icon: History },
    { name: "Similar Questions", href: "/dashboard/similar-questions", icon: Copy },
    { name: "Topic Analysis", href: "/dashboard/topic-analysis", icon: PieChart },
    { name: "Search Questions", href: "/dashboard/search", icon: Search },
    { name: "Saved Questions", href: "/dashboard/saved", icon: Bookmark },
    { name: "Recent Activity", href: "/dashboard/recent-activity", icon: Activity },
    { name: "Usage Statistics", href: "/dashboard/statistics", icon: BarChart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`w-64 h-screen bg-background-light dark:bg-background-dark border-r border-border-light dark:border-border-dark flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}>
        <div className="p-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
              <Network className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-poppins font-bold text-foreground-light dark:text-foreground-dark">
              LearnConnect
            </span>
          </Link>
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-800 bg-gray-100 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                    : "text-gray-500 hover:text-foreground-light dark:text-gray-400 dark:hover:text-foreground-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-light dark:border-border-dark shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
