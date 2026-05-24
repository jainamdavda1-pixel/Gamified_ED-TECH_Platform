"use client";

import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { MOCK_SUBJECT } from "@/lib/mockData";

export default function Sidebar({ role = "STUDENT" }: { role?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "Learner";
  const email = user?.emailAddresses[0]?.emailAddress || "";
  const avatar = user?.firstName ? (user.firstName[0] + (user.lastName ? user.lastName[0] : "")).toUpperCase() : "L";

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  // Determine dashboard link based on role
  let dashboardHref = "/dashboard/student";
  if (role === "TEACHER") dashboardHref = "/dashboard/faculty";
  if (role === "ADMIN") dashboardHref = "/dashboard/admin";

  const NAV_ITEMS = [
    {
      href: dashboardHref,
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      href: `/subject/${MOCK_SUBJECT.id}`,
      label: "My Subject",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      href: "/progress",
      label: "Progress",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col h-screen sticky top-0 bg-gray-900/70 border-r border-gray-800/60 backdrop-blur-xl transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 p-5 border-b border-gray-800/60">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/30">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-white leading-tight text-sm">kjsce ED-Tech Platform</p>
            <p className="text-xs text-gray-500">Algorithm Design</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-gray-500 hover:text-gray-300 transition"
          aria-label="Toggle sidebar"
          id="sidebar-toggle"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={collapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"}
            />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                  : "text-gray-400 hover:text-gray-100 hover:bg-gray-800/60"
              }`}
            >
              <span className={active ? "text-violet-400" : ""}>{item.icon}</span>
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info / Role indicator */}
      <div className="p-3 border-t border-gray-800/60">
        <div className={`flex flex-col gap-2 px-3 py-2.5 rounded-xl ${collapsed ? "" : "glass"}`}>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white">
              {avatar}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.fullName || firstName}</p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
              </div>
            )}
            {!collapsed && (
              <button
                id="logout-btn"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-400 transition"
                aria-label="Logout"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            )}
          </div>
          {!collapsed && (
            <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
              <span>Role:</span>
              <span className="font-bold text-violet-400 uppercase">{role === "TEACHER" ? "Faculty" : role}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
