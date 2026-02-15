import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

function AdminMembers() {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    setMembers(data || []);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Members</h2>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-3">Name</th>
            <th className="border p-3">Phone</th>
            <th className="border p-3">Role</th>
            <th className="border p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td className="border p-3">{member.full_name}</td>
              <td className="border p-3">{member.phone}</td>
              <td className="border p-3">{member.role}</td>
              <td className="border p-3">
                <button
                  onClick={() => navigate(`/admin/members/${member.id}`)}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminMembers;
