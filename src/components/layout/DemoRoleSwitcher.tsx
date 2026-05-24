"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shield } from "lucide-react";

export default function DemoRoleSwitcher({ currentRole }: { currentRole: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (role: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/faculty/toggle-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        // Force full browser navigation to bypass Next.js client-side router cache
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Failed to toggle role:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs">
      <Shield className="w-4 h-4 shrink-0 text-amber-400" />
      <span className="font-semibold hidden md:inline">Role Switcher (Demo):</span>
      <select
        value={currentRole}
        disabled={loading}
        onChange={(e) => handleRoleChange(e.target.value)}
        className="bg-gray-900 text-amber-200 border border-gray-800 rounded-lg px-2 py-0.5 outline-none text-xs cursor-pointer font-bold disabled:opacity-50"
      >
        <option value="STUDENT">Student View</option>
        <option value="TEACHER">Faculty View</option>
        <option value="ADMIN">Admin View</option>
      </select>
    </div>
  );
}
