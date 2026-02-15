import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

function AdminRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data } = await supabase
      .from("benefit_requests")
      .select("*, profiles(full_name, phone)")
      .order("created_at", { ascending: false });

    setRequests(data || []);
  };

  const updateStatus = async (id, status) => {
    await supabase
      .from("benefit_requests")
      .update({ status })
      .eq("id", id);

    fetchRequests();
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Benefit Requests</h2>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-3">Name</th>
            <th className="border p-3">Phone</th>
            <th className="border p-3">Message</th>
            <th className="border p-3">Status</th>
            <th className="border p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td className="border p-3">{req.profiles?.full_name}</td>
              <td className="border p-3">{req.profiles?.phone}</td>
              <td className="border p-3">{req.message}</td>
              <td className="border p-3">{req.status}</td>
              <td className="border p-3">
                <button
                  onClick={() => updateStatus(req.id, "APPROVED")}
                  className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(req.id, "REJECTED")}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminRequests;
