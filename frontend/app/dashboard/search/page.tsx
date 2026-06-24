"use client";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Search className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Search Questions</h1>
        <p className="text-gray-500 mb-6">This feature is currently under development. An advanced global search interface is coming soon.</p>
        <button className="px-6 py-2 bg-indigo-500 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20 hover:bg-indigo-600 transition-colors">
          Go Back
        </button>
      </motion.div>
    </div>
  );
}
