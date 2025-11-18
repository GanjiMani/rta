import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function MandateManagement() {
  const { fetchWithAuth } = useAuth();
  const [mandates, setMandates] = useState([]);
  const [form, setForm] = useState({ scheme: "", type: "UPI" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMandates();
  }, []);

  const fetchMandates = async () => {
    setError("");
    try {
      const res = await fetchWithAuth(`/investor/mandates`);
      if (!res.ok) throw new Error("Failed to fetch mandates");
      const data = await res.json();
      setMandates(data);
    } catch (err) {
      setError(err.message);
    }
  };

const register = async () => {
  if (!form.scheme) {
    alert("Select scheme");
    return;
  }
  const payload = {
    ...form,
    created: new Date().toISOString().slice(0, 10), // format as "YYYY-MM-DD"
  };

  try {
    const res = await fetchWithAuth(`/investor/mandates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Failed to register mandate");
    }
    const newM = await res.json();
    setMandates((prev) => [...prev, newM]);
    setForm({ scheme: "", type: "UPI" });
    alert("Mandate registered.");
  } catch (err) {
    setError(err.message);
  }
};

  const revoke = async (id) => {
    setError("");
    try {
      const res = await fetchWithAuth(`/investor/mandates/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to revoke mandate");
      }
      setMandates((prev) => prev.map((m) => (m.id === id ? { ...m, status: "Revoked" } : m)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Mandate Management</h2>

      {error && <p className="mb-4 text-red-600 font-semibold">{error}</p>}

      <div className="bg-white shadow rounded p-6 mb-4">
        <div className="grid md:grid-cols-3 gap-3 items-end">
          <input
            placeholder="Scheme (e.g., SIP - ABC Equity Fund)"
            value={form.scheme}
            onChange={(e) => setForm({ ...form, scheme: e.target.value })}
            className="input"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="input"
          >
            <option value="UPI">UPI</option>
            <option value="ECS">ECS</option>
            <option value="NetBanking">NetBanking</option>
          </select>
          <button onClick={register} className="bg-blue-600 text-white px-4 py-2 rounded">
            Register Mandate
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-6">
        <h3 className="font-semibold mb-3">Your Mandates</h3>
        {mandates.length === 0 ? (
          <p className="text-gray-600">No mandates found.</p>
        ) : (
          <div className="space-y-2">
            {mandates.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between border p-3 rounded"
              >
                <div>
                  <div className="font-semibold">{m.scheme}</div>
                  <div className="text-sm text-gray-500">
                    {m.type} • Created: {m.created}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`text-sm font-semibold ${
                      m.status === "Active"
                        ? "text-green-600"
                        : m.status === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {m.status}
                  </div>
                  {m.status !== "Revoked" && (
                    <button
                      onClick={() => revoke(m.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
