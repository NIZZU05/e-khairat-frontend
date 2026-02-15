import { Menu, LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function Navbar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-gray-700"
      >
        <Menu size={22} />
      </button>

      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

    </header>
  );
}

export default Navbar;
