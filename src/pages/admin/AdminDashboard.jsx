import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

function AdminDashboard() {
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    setTotalMembers(count || 0);

    const { data: payments } = await supabase.from("payments").select("amount");
    const total = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
    setTotalPayments(total);

    const { count: pending } = await supabase
      .from("benefit_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "PENDING");

    setPendingRequests(pending || 0);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>

      <table className="w-full border text-center">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-4 border">Total Members</th>
            <th className="p-4 border">Total Payments</th>
            <th className="p-4 border">Pending Requests</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-6 border text-xl font-bold">{totalMembers}</td>
            <td className="p-6 border text-xl font-bold">RM {totalPayments}</td>
            <td className="p-6 border text-xl font-bold">{pendingRequests}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
