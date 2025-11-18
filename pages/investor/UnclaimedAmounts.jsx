import React, { useEffect, useState } from "react";
import { useAuth } from "../../services/AuthContext";

export default function UnclaimedAmounts() {
  const { token } = useAuth();
  const [unclaimed, setUnclaimed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUnclaimed() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("http://localhost:8000/investor/investor/unclaimed-amounts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch unclaimed amounts");
        const data = await response.json();
        setUnclaimed(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUnclaimed();
  }, [token]);

  const handleClaim = async (unclaimedId) => {
    try {
      const response = await fetch("http://localhost:8000/investor/investor/unclaimed-claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ unclaimed_id: unclaimedId }),
      });
      if (!response.ok) throw new Error("Claim request failed");
      alert(`Claim request sent for ${unclaimedId}`);
      setUnclaimed((prev) => prev.filter((u) => u.unclaimed_id !== unclaimedId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading unclaimed amounts...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Unclaimed Amounts</h2>
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Transaction ID</th>
              <th className="p-2 border">Scheme</th>
              <th className="p-2 border">Folio</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Amount (₹)</th>
              <th className="p-2 border">Unclaimed Since</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {unclaimed.map((u, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-2 border">{u.txn_id}</td>
                <td className="p-2 border">{u.scheme}</td>
                <td className="p-2 border">{u.folio}</td>
                <td className="p-2 border">{u.type}</td>
                <td className="p-2 border">₹{u.amount.toLocaleString()}</td>
                <td className="p-2 border">{new Date(u.unclaimed_since).toLocaleDateString()}</td>
                <td
                  className={`p-2 border font-semibold ${
                    u.status === "Pending"
                      ? "text-yellow-600"
                      : u.status === "Processing"
                      ? "text-blue-600"
                      : "text-green-600"
                  }`}
                >
                  {u.status}
                </td>
                <td className="p-2 border">{u.description}</td>
                <td className="p-2 border">
                  {u.status !== "Claimed" ? (
                    <button
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      onClick={() => handleClaim(u.unclaimed_id)}
                    >
                      Claim
                    </button>
                  ) : (
                    <span className="text-gray-500">Claimed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
