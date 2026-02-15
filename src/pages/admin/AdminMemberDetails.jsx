import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function AdminMemberDetails() {
  const { id } = useParams();

  const [member, setMember] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberData();
  }, [id]);

  const fetchMemberData = async () => {
    setLoading(true);

    /* 1️⃣ GET PROFILE */
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    setMember(profile);

    /* 2️⃣ GET FAMILY (USING primary_member_id) */
    const { data: family } = await supabase
      .from("families")
      .select("id")
      .eq("primary_member_id", id)
      .single();

    if (family) {
      /* 3️⃣ GET FAMILY MEMBERS USING family_id */
      const { data: members } = await supabase
        .from("family_members")
        .select("full_name, relationship")
        .eq("family_id", family.id)
        .order("created_at", { ascending: false });

      setFamilyMembers(members || []);
    } else {
      setFamilyMembers([]);
    }

    setLoading(false);
  };

  /* DOWNLOAD FUNCTION */
  const downloadData = () => {
    const data = {
      profile: member,
      familyMembers,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `member-${member.full_name}.json`;
    a.click();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Member Details</h1>

      {member && (
        <div className="mb-6">
          <p><strong>Name:</strong> {member.full_name}</p>
          <p><strong>Phone:</strong> {member.phone}</p>
          <p><strong>Role:</strong> {member.role}</p>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Family Members</h2>

      <table className="w-full border border-gray-400">
        <thead className="bg-emerald-700 text-white">
          <tr>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Relationship</th>
          </tr>
        </thead>
        <tbody>
          {familyMembers.length === 0 ? (
            <tr>
              <td colSpan="2" className="p-4 text-center">
                No family members found.
              </td>
            </tr>
          ) : (
            familyMembers.map((m, index) => (
              <tr key={index} className="border">
                <td className="p-3 border">{m.full_name}</td>
                <td className="p-3 border">{m.relationship}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button
        onClick={downloadData}
        className="mt-6 bg-emerald-700 text-white px-6 py-2 rounded"
      >
        Download Data
      </button>
    </div>
  );
}

export default AdminMemberDetails;
