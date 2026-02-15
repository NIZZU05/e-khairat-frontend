import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";

function Sidebar({ collapsed }) {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "Members", icon: Users, path: "/admin/members" },
    { name: "Events", icon: FileText, path: "/admin/events" },
    { name: "Payments", icon: CreditCard, path: "/admin/payments" },
    { name: "Reports", icon: BarChart3, path: "/admin/reports" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <aside
      className={`bg-[#0F5132] text-white transition-all duration-300 ${
        collapsed ? "w-[80px]" : "w-[260px]"
      }`}
    >
      <div className="h-16 flex items-center justify-center text-xl font-bold text-[#C9A227]">
        {collapsed ? "AK" : "Al-Khairat"}
      </div>

      <nav className="mt-6 space-y-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center gap-4 px-6 py-3 hover:bg-white/10 transition"
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
