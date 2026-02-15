import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function MemberDashboard() {
  const navigate = useNavigate();

  const [familyMembers, setFamilyMembers] = useState([]);
  const [totalContribution, setTotalContribution] = useState(0);
  const [showBenefitModal, setShowBenefitModal] = useState(false);
  const [benefitMessage, setBenefitMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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

    const { data: payments } = await supabase
      .from("payouts")
      .select("amount")
      .eq("member_id", user.id);

    const total =
      payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

    setTotalContribution(total);
  };

  const handleSendBenefit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (!benefitMessage.trim())
      return alert("Please enter message.");

    const { error } = await supabase
      .from("benefit_requests")
      .insert({
        member_id: user.id,
        message: benefitMessage,
        status: "PENDING"
      });

    if (error) return alert(error.message);

    alert("Request sent to admin.");
    setShowBenefitModal(false);
    setBenefitMessage("");
  };

  const handlePrint = () => window.print();

  const activeCount = familyMembers.filter(m => m.is_active).length;
  const deceasedCount = familyMembers.filter(m => m.is_deceased).length;

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa')",
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 py-16 px-6">
        <div className="max-w-6xl mx-auto bg-white/95 rounded-3xl shadow-2xl p-12">

          <h1 className="text-4xl font-bold text-center text-emerald-800 mb-10">
            Member Dashboard
          </h1>

          {/* SUMMARY TABLE (Admin Style) */}
          <table className="w-full border-collapse border border-black text-center mb-10">
            <thead className="bg-emerald-700 text-white">
              <tr>
                <th className="border border-black p-3">Total</th>
                <th className="border border-black p-3">Active</th>
                <th className="border border-black p-3">Deceased</th>
                <th className="border border-black p-3">Contribution</th>
              </tr>
            </thead>
            <tbody className="bg-white font-semibold">
              <tr>
                <td className="border border-black p-3">{familyMembers.length}</td>
                <td className="border border-black p-3">{activeCount}</td>
                <td className="border border-black p-3">{deceasedCount}</td>
                <td className="border border-black p-3">
                  RM {totalContribution}
                </td>
              </tr>
            </tbody>
          </table>

          {/* FAMILY TABLE (Admin Style) */}
          <table className="w-full border-collapse border border-black">
            <thead className="bg-emerald-700 text-white">
              <tr>
                <th className="border border-black p-3 text-left">Name</th>
                <th className="border border-black p-3 text-left">Email</th>
                <th className="border border-black p-3 text-left">Phone</th>
                <th className="border border-black p-3 text-left">Relationship</th>
              </tr>
            </thead>
            <tbody>
              {familyMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="border border-black p-4 text-center bg-white"
                  >
                    No family members found.
                  </td>
                </tr>
              ) : (
                familyMembers.map(member => (
                  <tr key={member.id} className="bg-white">
                    <td className="border border-black p-3">
                      {member.full_name}
                    </td>
                    <td className="border border-black p-3">
                      {member.email || "-"}
                    </td>
                    <td className="border border-black p-3">
                      {member.phone || "-"}
                    </td>
                    <td className="border border-black p-3">
                      {member.relationship}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* BUTTONS */}
          <div className="mt-8 flex justify-center gap-6">
            <button
              onClick={() => navigate("/edit-profile")}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              Edit Profile
            </button>

            <button
              onClick={() => setShowBenefitModal(true)}
              className="bg-emerald-700 text-white px-6 py-2 rounded"
            >
              Request Benefit
            </button>

            <button
              onClick={handlePrint}
              className="bg-gray-900 text-white px-6 py-2 rounded"
            >
              Print
            </button>
          </div>

        </div>
      </div>

      {/* BENEFIT MODAL */}
      {showBenefitModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-96">
            <h2 className="text-xl font-bold mb-4">Request Benefit</h2>

            <textarea
              className="w-full border p-3 mb-4"
              rows="4"
              value={benefitMessage}
              onChange={(e) => setBenefitMessage(e.target.value)}
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowBenefitModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSendBenefit}
                className="bg-emerald-700 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberDashboard;
