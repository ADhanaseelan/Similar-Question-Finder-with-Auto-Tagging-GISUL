"use client";
import { Settings, User, Bell, Shield, Moon, Monitor, Palette, Save, LogOut, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [userName, setUserName] = useState("Loading...");

  const [taxonomy, setTaxonomy] = useState<string[]>([]);

  useEffect(() => {
    // Mock user details fetch
    const email = localStorage.getItem("userEmail") || "user@example.com";
    setUserName(email.split('@')[0]);

    // Fetch taxonomy
    const fetchTaxonomy = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("http://localhost:8000/api/dashboard/taxonomy", {
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
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h2>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-lg border border-gray-200 transition-colors">
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="space-y-5 max-w-lg">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Display Name</label>
                    <input type="text" defaultValue={userName} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" defaultValue={`${userName}@example.com`} disabled className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed outline-none font-medium" />
                  </div>
                  <div className="pt-4">
                    <button className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors flex items-center gap-2">
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "appearance" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Theme Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ThemeOption icon={<Monitor className="w-6 h-6" />} label="System Default" active={true} />
                  <ThemeOption icon={<Moon className="w-6 h-6" />} label="Dark Mode" active={false} />
                  <ThemeOption icon={<Palette className="w-6 h-6" />} label="Light Mode" active={false} />
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
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Security & Password</h2>
                <div className="space-y-5 max-w-lg">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none transition-all font-medium" />
                  </div>
                  <div className="pt-4">
                    <button className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors">
                      Update Password
                    </button>
                  </div>
                </div>
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
