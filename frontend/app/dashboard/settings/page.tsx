"use client";
import { motion } from "framer-motion";
import { Moon, Sun, Monitor, Bell, Shield, Key } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function SettingsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-3xl"
    >
      <div>
        <h1 className="text-4xl font-poppins font-extrabold text-foreground-light dark:text-foreground-dark mb-2">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Manage your app preferences and settings.</p>
      </div>

      <div className="space-y-6">
        <GlassCard>
          <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-6 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-primary" /> Appearance
          </h3>
          <div className="flex gap-4">
            <button className="flex-1 p-4 rounded-xl border-2 border-primary bg-primary/5 flex flex-col items-center gap-2">
              <Sun className="w-6 h-6 text-primary" />
              <span className="font-bold text-primary">Light</span>
            </button>
            <button className="flex-1 p-4 rounded-xl border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col items-center gap-2 transition-all">
              <Moon className="w-6 h-6 text-gray-500" />
              <span className="font-bold text-gray-500">Dark</span>
            </button>
            <button className="flex-1 p-4 rounded-xl border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col items-center gap-2 transition-all">
              <Monitor className="w-6 h-6 text-gray-500" />
              <span className="font-bold text-gray-500">System</span>
            </button>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-secondary" /> Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div>
                <h4 className="font-bold text-foreground-light dark:text-foreground-dark">Push Notifications</h4>
                <p className="text-sm text-gray-500">Receive alerts on new similarities found.</p>
              </div>
              <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div>
                <h4 className="font-bold text-foreground-light dark:text-foreground-dark">Email Digest</h4>
                <p className="text-sm text-gray-500">Weekly summary of your learning progress.</p>
              </div>
              <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" /> Privacy & Security
          </h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-gray-500" />
                <span className="font-bold text-foreground-light dark:text-foreground-dark">Change Password</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-500">
              <span className="font-bold">Delete Account</span>
            </button>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
