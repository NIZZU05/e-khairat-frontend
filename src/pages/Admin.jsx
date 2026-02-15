import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Admin() {
  const [membersCount, setMembersCount] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [benefitRequests, setBenefitRequests] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    // MEMBERS COUNT
    const { count } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    setMembersCount(count || 0);

    // PAYMENTS
    const { data: payments } = await supabase
      .from("payouts")
      .select("amount");

    const total =
      payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

    setTotalPayments(total);

    // BENEFIT REQUESTS
    const { data: requests } = await supabase
      .from("benefit_requests")
      .select("*")
      .order("created_at", { ascending: false });

    setBenefitRequests(requests || []);
  };

  const handleApprove = async (id) => {
    await supabase
      .from("benefit_requests")
      .update({ status: "APPROVED" })
      .eq("id", id);

    fetchAdminData();
  };

  const handleReject = async (id) => {
    await supabase
      .from("benefit_requests")
      .update({ status: "REJECTED" })
      .eq("id", id);

    fetchAdminData();
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 shadow rounded">
          <h3>Total Members</h3>
          <p className="text-xl font-bold">{membersCount}</p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h3>Total Payments</h3>
          <p className="text-xl font-bold">
            RM {totalPayments}
          </p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h3>Pending Requests</h3>
          <p className="text-xl font-bold">
            {
              benefitRequests.filter(
                r => r.status === "PENDING"
              ).length
            }
          </p>
        </div>
      </div>

      {/* BENEFIT REQUEST TABLE */}
      <h2 className="text-2xl font-semibold mb-4">
        Benefit Requests
      </h2>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Member ID</th>
            <th className="p-3">Message</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {benefitRequests.map((req) => (
            <tr key={req.id} className="border-b">
              <td className="p-3">{req.member_id}</td>
              <td className="p-3">{req.message}</td>
              <td className="p-3">{req.status}</td>
              <td className="p-3 flex gap-2">
                {req.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(req.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
