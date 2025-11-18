import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow sticky top-0 z-40 flex flex-nowrap lg:flex-wrap justify-between items-center px-4 py-3">
      {/* Left section: menu toggle and branding */}
      <div className="flex items-center gap-4 min-w-[150px]">
        {user && (
          <button
            className="lg:hidden p-2 rounded hover:bg-gray-200"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {/* Hamburger icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
        <div className="font-bold text-xl whitespace-nowrap">RTA Portal</div>
      </div>

      {/* Right section: greeting and action buttons */}
      <div className="flex items-center gap-3 min-w-[150px] justify-end">
        {user ? (
          <>
            <span className="text-sm text-gray-700 whitespace-nowrap">Hi, {user.name}</span>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded whitespace-nowrap min-w-[72px]"
              aria-label="Logout"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded whitespace-nowrap" aria-label="Investor Login">
                Investor Login
              </button>
            </Link>
            <Link to="/admin/login">
              <button className="bg-gray-800 hover:bg-black text-white px-3 py-1 rounded whitespace-nowrap" aria-label="Admin Login">
                Admin Login
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
