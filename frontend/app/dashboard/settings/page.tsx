"use client";
import { Settings, User, Bell, Shield, Moon, Monitor, Palette, Save, LogOut, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile State
  const [userProfile, setUserProfile] = useState({ id: "", email: "", displayName: "", authProvider: "" });
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [profileMessage, setProfileMessage] = useState({ text: "", type: "" });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [taxonomy, setTaxonomy] = useState<string[]>([]);
  
  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [securityMessage, setSecurityMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    // Check initial dark mode state
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark";
      setIsDarkMode(isDark);
      if (isDark) document.documentElement.classList.add("dark");
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("/api/users/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserProfile(data);
          setDisplayNameInput(data.displayName);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchProfile();
    const fetchTaxonomy = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("/api/dashboard/taxonomy", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTaxonomy(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchTaxonomy();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  const handleUpdateProfile = async () => {
    setProfileMessage({ text: "", type: "" });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: displayNameInput })
      });
      if (res.ok) {
        setUserProfile(prev => ({ ...prev, displayName: displayNameInput }));
        setProfileMessage({ text: "Profile updated successfully!", type: "success" });
      } else {
        setProfileMessage({ text: "Failed to update profile.", type: "error" });
      }
    } catch (e) {
      setProfileMessage({ text: "An error occurred.", type: "error" });
    }
  };

  const handleUpdatePassword = async () => {
    setSecurityMessage({ text: "", type: "" });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setSecurityMessage({ text: "Password updated successfully!", type: "success" });
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setSecurityMessage({ text: data.detail || "Failed to update password.", type: "error" });
      }
    } catch (e) {
      setSecurityMessage({ text: "An error occurred.", type: "error" });
    }
  };

  const toggleTheme = (theme: "light" | "dark" | "system") => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      localStorage.removeItem("theme");
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemDark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      setIsDarkMode(systemDark);
    }
  };

  return (
    <div className="pb-12 max-w-5xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
            <Settings className="w-8 h-8 text-gray-600" /> Platform Settings
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Manage your account, preferences, and security.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR NAVIGATION */}
        <div className="w-full lg:w-64 shrink-0 space-y-2">
          <TabButton 
            active={activeTab === "profile"} 
            onClick={() => setActiveTab("profile")} 
            icon={<User className="w-5 h-5" />} 
            label="My Profile" 
          />
          <TabButton 
            active={activeTab === "appearance"} 
            onClick={() => setActiveTab("appearance")} 
            icon={<Palette className="w-5 h-5" />} 
            label="Appearance" 
          />
          <TabButton 
            active={activeTab === "notifications"} 
            onClick={() => setActiveTab("notifications")} 
            icon={<Bell className="w-5 h-5" />} 
            label="Notifications" 
          />
          <TabButton 
            active={activeTab === "security"} 
            onClick={() => setActiveTab("security")} 
            icon={<Shield className="w-5 h-5" />} 
            label="Security" 
          />
          <TabButton 
            active={activeTab === "taxonomy"} 
            onClick={() => setActiveTab("taxonomy")} 
            icon={<Target className="w-5 h-5" />} 
            label="Taxonomy Management" 
          />
          
          <div className="pt-6 mt-6 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Profile Information</h2>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {userProfile.displayName ? userProfile.displayName.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-lg border border-gray-200 dark:border-gray-600 transition-colors">
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="space-y-5 max-w-lg">
                  {profileMessage.text && (
                    <div className={`p-3 rounded-xl text-sm font-bold ${profileMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {profileMessage.text}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Display Name</label>
                    <input type="text" value={displayNameInput} onChange={e => setDisplayNameInput(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" value={userProfile.email} disabled className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 cursor-not-allowed outline-none font-medium" />
                  </div>
                  <div className="pt-4">
                    <button onClick={handleUpdateProfile} className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "appearance" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Theme Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div onClick={() => toggleTheme("system")}>
                    <ThemeOption icon={<Monitor className="w-6 h-6" />} label="System Default" active={false} />
                  </div>
                  <div onClick={() => toggleTheme("dark")}>
                    <ThemeOption icon={<Moon className="w-6 h-6" />} label="Dark Mode" active={isDarkMode} />
                  </div>
                  <div onClick={() => toggleTheme("light")}>
                    <ThemeOption icon={<Palette className="w-6 h-6" />} label="Light Mode" active={!isDarkMode} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Notification Settings</h2>
                <div className="space-y-4">
                  <ToggleOption title="Daily Study Reminders" desc="Get a notification to review your saved questions." active={true} />
                  <ToggleOption title="Weekly Analytics Report" desc="Receive an email summarizing your learning velocity." active={false} />
                  <ToggleOption title="Product Updates" desc="Hear about new features and improvements." active={true} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Security & Password</h2>
                
                {userProfile.authProvider === "google" ? (
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-2xl">
                    <p className="text-blue-800 dark:text-blue-300 font-bold">Google Authentication Active</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 font-medium">Your password is managed securely by Google. You cannot change it here.</p>
                  </div>
                ) : (
                  <div className="space-y-5 max-w-lg">
                    {securityMessage.text && (
                      <div className={`p-3 rounded-xl text-sm font-bold ${securityMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {securityMessage.text}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Current Password</label>
                      <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-medium" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">New Password</label>
                      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 outline-none transition-all font-medium" />
                    </div>
                    <div className="pt-4">
                      <button onClick={handleUpdatePassword} className="px-6 py-3 bg-gray-900 dark:bg-indigo-500 text-white font-bold rounded-xl hover:bg-black dark:hover:bg-indigo-600 transition-colors shadow-lg">
                        Update Password
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "taxonomy" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Taxonomy Management</h2>
                <p className="text-gray-500 font-medium mb-6">View the list of valid topic tags currently mapped in the AI model's training data.</p>
                <div className="flex flex-wrap gap-2">
                  {taxonomy.length > 0 ? taxonomy.map((topic, i) => (
                    <div key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors rounded-lg text-sm font-bold border border-indigo-100">
                      {topic}
                    </div>
                  )) : (
                    <p className="text-gray-400 font-medium">Loading taxonomy...</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Subcomponents
function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
        active 
          ? "bg-indigo-50 text-indigo-600" 
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ThemeOption({ icon, label, active }: any) {
  return (
    <div className={`cursor-pointer flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${active ? 'border-indigo-500 bg-indigo-50/50 text-indigo-600' : 'border-gray-100 hover:border-gray-200 text-gray-500'}`}>
      {icon}
      <span className="font-bold">{label}</span>
    </div>
  );
}

function ToggleOption({ title, desc, active }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
      <div>
        <p className="font-bold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500 font-medium">{desc}</p>
      </div>
      <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-indigo-500' : 'bg-gray-200'}`}>
        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${active ? 'left-7' : 'left-1'}`} />
      </div>
    </div>
  );
}
