"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Settings, Shield, Bell, Save, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Standard Member",
    notifications: true,
  });

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
          setFormData(prev => ({
            ...prev,
            name: data.displayName || "",
            email: data.email || ""
          }));
        }
      } catch (e) {
        console.error("Failed to fetch profile", e);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/users/me", {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: formData.name })
      });
      if (res.ok) {
        setMessage({ text: "Profile saved successfully!", type: "success" });
      } else {
        setMessage({ text: "Failed to update profile.", type: "error" });
      }
    } catch (e) {
      setMessage({ text: "An error occurred.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-3xl"
    >
      <div>
        <h1 className="text-4xl font-poppins font-extrabold text-foreground-light dark:text-foreground-dark mb-2">Your Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <GlassCard className="text-center p-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center mb-4 text-3xl text-white font-bold">
              {formData.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark">{formData.name}</h3>
            <p className="text-sm font-medium text-gray-500 mb-4">{formData.role}</p>
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
              Active
            </span>
          </GlassCard>

          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 text-foreground-light dark:text-foreground-dark font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors">
              <User className="w-5 h-5 text-gray-500" /> Account
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-foreground-light dark:hover:text-foreground-dark font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Shield className="w-5 h-5" /> Security
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-foreground-light dark:hover:text-foreground-dark font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bell className="w-5 h-5" /> Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-foreground-light dark:hover:text-foreground-dark font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Settings className="w-5 h-5" /> Preferences
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <GlassCard>
            <h3 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark mb-6">Account Details</h3>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4">
                {message.text && (
                  <div className={`p-3 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {message.text}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-foreground-light dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    disabled
                    value={formData.email}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-500"
                  />
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-foreground-light dark:text-foreground-dark">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive weekly study summaries and tips.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.notifications}
                        onChange={e => setFormData({...formData, notifications: e.target.checked})}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-colors shadow-lg shadow-primary/20"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
