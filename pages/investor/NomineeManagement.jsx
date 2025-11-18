import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function NomineeManagement() {
  const { fetchWithAuth } = useAuth();
  const [nominees, setNominees] = useState([]);
  const [form, setForm] = useState({ name: "", relation: "", allocation: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNominees = async () => {
      try {
        const res = await fetchWithAuth(`/investor/profile`);
        if (!res.ok) throw new Error("Unable to fetch nominees");
        const data = await res.json();
        setNominees(data.nominees || []);
      } catch (err) {
        setError("Failed to load nominees: " + err.message);
      }
    };
    fetchNominees();
  }, [fetchWithAuth]);

  const addNominee = async () => {
    const total = nominees.reduce((s, n) => s + Number(n.pct), 0) + Number(form.allocation);
    if (!form.name || !form.relation) {
      setError("Name & relation required");
      return;
    }
    if (form.allocation <= 0) {
      setError("Allocation must be > 0");
      return;
    }
    if (total > 100) {
      setError("Total allocation cannot exceed 100%");
      return;
    }
    try {
      const res = await fetchWithAuth(`/investor/nominees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          relation: form.relation,
          pct: form.allocation,
        }),
      });
      if (!res.ok) throw new Error("Failed to add nominee");
      const newNominee = await res.json();
      setNominees((prev) => [...prev, newNominee]);
      setForm({ name: "", relation: "", allocation: 0 });
      setError("");
    } catch (err) {
      setError("Failed to add nominee: " + err.message);
    }
  };

  const removeNominee = async (nomineeId) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/investor/nominees/${nomineeId}`, {
        method: "DELETE",
      });
      if (res.status !== 204) throw new Error("Failed to delete nominee");
      setNominees((prev) => prev.filter((n) => n.nominee_id !== nomineeId));
    } catch (err) {
      setError("Failed to delete nominee: " + err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Nominee Management</h2>
      {error && <div className="text-red-500 mb-3">{error}</div>}
      <div className="bg-white shadow rounded p-6">
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          <input
            placeholder="Nominee Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
          />
          <input
            placeholder="Relation"
            value={form.relation}
            onChange={(e) => setForm({ ...form, relation: e.target.value })}
            className="input"
          />
          <input
            type="number"
            placeholder="Allocation (%)"
            value={form.allocation}
            onChange={(e) => setForm({ ...form, allocation: e.target.value })}
            className="input"
          />
        </div>
        <div className="mb-4">
          <button onClick={addNominee} className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Nominee
          </button>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Current Nominees</h3>
          <div className="space-y-2">
            {nominees.map((n) => (
              <div key={n.nominee_id} className="flex items-center justify-between border p-3 rounded">
                <div>
                  <div className="font-semibold">
                    {n.name} <span className="text-sm text-gray-500">({n.relation})</span>
                  </div>
                  <div className="text-sm text-gray-600">Allocation: {n.pct}%</div>
                </div>
                <div>
                  <button
                    onClick={() => removeNominee(n.nominee_id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Total Allocation: {nominees.reduce((s, n) => s + Number(n.pct), 0)}%
          </div>
        </div>
      </div>
    </div>
  );
}
