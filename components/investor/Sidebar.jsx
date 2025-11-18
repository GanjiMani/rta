import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../services/AuthContext";
import {
  LayoutDashboard,
  Wallet,
  LineChart,
  FileText,
  User,
  CreditCard,
  Users,
  Shield,
  Settings,
  Bell,
  HelpCircle,
  Repeat,
  DollarSign,
  RefreshCcw,
  Shuffle,
  BadgeIndianRupee,
  FileSpreadsheet,
  FileBarChart,
  FileArchive,
} from "lucide-react";

const sections = [
  {
    title: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/folio/1", label: "Folio Details", icon: FileText },
      { to: "/transactions", label: "Transaction History", icon: RefreshCcw },
      { to: "/analytics/allocation", label: "Asset Allocation", icon: LineChart },
    ],
  },
  {
    title: "Investments",
    items: [
      { to: "/purchase", label: "Purchase", icon: Wallet },
      { to: "/redemption", label: "Redemption", icon: DollarSign },
      { to: "/sip", label: "SIP Setup", icon: Repeat },
      { to: "/swp", label: "SWP Setup", icon: Shuffle },
      { to: "/stp", label: "STP Setup", icon: RefreshCcw },
      { to: "/switch", label: "Switch", icon: Shuffle },
      { to: "/idcw", label: "IDCW Preferences", icon: BadgeIndianRupee },
      { to: "/unclaimed", label: "Unclaimed Amounts", icon: FileArchive },
    ],
  },
  {
    title: "Reports",
    items: [
      { to: "/reports/capital-gains", label: "Capital Gains", icon: FileBarChart },
      { to: "/reports/valuation", label: "Valuation Report", icon: FileSpreadsheet },
      { to: "/reports/cas", label: "CAS Download", icon: FileText },
    ],
  },
  {
    title: "Profile",
    items: [
      { to: "/profile", label: "Profile Overview", icon: User },
      { to: "/profile/banks", label: "Bank Mandates", icon: CreditCard },
      { to: "/profile/nominees", label: "Nominee Management", icon: Users },
      { to: "/profile/security", label: "Security Settings", icon: Shield },
      { to: "/profile/documents", label: "Document Manager", icon: FileArchive }, 
    ],
  },
  {
    title: "Services",
    items: [
      { to: "/mandates", label: "Mandate Management", icon: Settings },
      { to: "/service-requests", label: "Service Requests", icon: FileText },
      { to: "/notifications", label: "Notifications", icon: Bell },
      { to: "/complaints", label: "Investor Complaints", icon: Shield },
      { to: "/support", label: "Support", icon: HelpCircle },
       { to: "/disclosures", label: "Regulatory Disclosures", icon: FileArchive }, 
      
    ],
  },
    {
      title: "Clients",
      items: [
        { to: "/clients", label: "My Agents", icon: Users },
      ],
    },

];

export default function Sidebar({ className = "" }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <aside
      className={`w-64 bg-white rounded-2xl p-4 shadow-md h-screen sticky top-0 ${className}`}
    >
      {/* Sidebar Header */}
      <div className="mb-4 text-lg font-semibold">Investor Portal</div>

      {/* Scrollable Navigation */}
      <nav className="flex flex-col gap-6 overflow-y-auto h-[calc(100vh-64px)] scroll-smooth pr-1">
        {sections.map((section, si) => (
          <div key={si}>
            <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
              {section.title}
            </div>
            <div className="flex flex-col gap-1">
              {section.items.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md transition ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "hover:bg-blue-100 text-gray-700"
                    }`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
