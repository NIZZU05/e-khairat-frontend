import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa')",
      }}
    >
      <div className="min-h-screen bg-black/70 flex">

        {/* SIDEBAR */}
        <div className="w-64 bg-emerald-900 text-white p-6">
          <h2 className="text-2xl font-bold mb-8">
            Admin Panel
          </h2>

          <nav className="space-y-4">
            <Link to="/admin/dashboard" className="block hover:text-yellow-400">
              Dashboard
            </Link>

            <Link to="/admin/members" className="block hover:text-yellow-400">
              Members
            </Link>

            <Link to="/admin/requests" className="block hover:text-yellow-400">
              Pending Requests
            </Link>
          </nav>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-10">
          <div className="bg-white/95 rounded-3xl shadow-2xl p-10 min-h-[80vh]">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminLayout;
