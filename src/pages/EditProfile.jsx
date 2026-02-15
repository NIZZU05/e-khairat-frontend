import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [newMember, setNewMember] = useState({
    full_name: "",
    email: "",
    phone: "",
    relationship: ""
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: family } = await supabase
      .from("families")
      .select("id")
      .eq("primary_member_id", user.id)
      .single();

    if (!family) return;

    const { data: members } = await supabase
      .from("family_members")
      .select("*")
      .eq("family_id", family.id);

    setFamilyMembers(members || []);
  };

  const handleAddMember = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: family } = await supabase
      .from("families")
      .select("id")
      .eq("primary_member_id", user.id)
      .single();

    const { error } = await supabase.from("family_members").insert({
      family_id: family.id,
      full_name: newMember.full_name,
      email: newMember.email,
      phone: newMember.phone,
      relationship: newMember.relationship,
      is_active: true,
      is_deceased: false
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Family member added successfully.");
    setNewMember({
      full_name: "",
      email: "",
      phone: "",
      relationship: ""
    });

    fetchMembers();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-xl">

        <h1 className="text-3xl font-bold mb-8 text-emerald-700">
          Edit Profile / Manage Family Members
        </h1>

        {/* Add Member Form */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <input
            className="border p-2 rounded"
            placeholder="Full Name"
            value={newMember.full_name}
            onChange={(e) =>
              setNewMember({ ...newMember, full_name: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Email"
            value={newMember.email}
            onChange={(e) =>
              setNewMember({ ...newMember, email: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Phone"
            value={newMember.phone}
            onChange={(e) =>
              setNewMember({ ...newMember, phone: e.target.value })
            }
          />

          <input
            className="border p-2 rounded"
            placeholder="Relationship"
            value={newMember.relationship}
            onChange={(e) =>
              setNewMember({ ...newMember, relationship: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleAddMember}
          className="bg-emerald-700 text-white px-6 py-2 rounded-lg mb-8"
        >
          Add Member
        </button>

        {/* Members Table */}
        <table className="w-full border">
          <thead className="bg-emerald-700 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Relationship</th>
            </tr>
          </thead>

          <tbody>
            {familyMembers.map(member => (
              <tr key={member.id} className="border-b">
                <td className="p-3">{member.full_name}</td>
                <td className="p-3">{member.email || "-"}</td>
                <td className="p-3">{member.phone || "-"}</td>
                <td className="p-3">{member.relationship}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-8 bg-gray-700 text-white px-6 py-2 rounded"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}

export default EditProfile;
