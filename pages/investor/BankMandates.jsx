import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function BankMandates() {
  const { fetchWithAuth } = useAuth();
  const [banks, setBanks] = useState([]);
  const [form, setForm] = useState({ account: "", ifsc: "", branch: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetchWithAuth(`/investor/profile`);
        if (!res.ok) throw new Error("Unable to fetch banks");
        const data = await res.json();
        setBanks(data.banks || []);
      } catch (err) {
        setError("Failed to load banks: " + err.message);
      }
    };
    fetchBanks();
  }, [fetchWithAuth]);

  const addBank = async () => {
    if (!form.account || !form.ifsc) {
      setError("Enter account & IFSC");
      return;
    }
    try {
      const res = await fetchWithAuth(`/investor/banks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_no: form.account,
          ifsc: form.ifsc,
          branch: form.branch,
        }),
      });
      if (!res.ok) throw new Error("Failed to add bank");
      const newBank = await res.json();
      setBanks((prev) => [...prev, newBank]);
      setForm({ account: "", ifsc: "", branch: "" });
      setError("");
    } catch (err) {
      setError("Failed to add bank: " + err.message);
    }
  };

  const removeBank = async (bankId) => {
    try {
      const res = await fetchWithAuth(`/investor/banks/${bankId}`, {
        method: "DELETE",
      });
      if (res.status !== 204) throw new Error("Failed to delete bank");
      setBanks((prev) => prev.filter((b) => b.bank_id !== bankId));
    } catch (err) {
      setError("Failed to delete bank: " + err.message);
    }
  };

  const setDefault = async (bankId) => {
    try {
      // Update all banks to set is_default = false except the selected one
      const updatedBanks = banks.map((b) => ({
        ...b,
        is_default: b.bank_id === bankId,
      }));
      // Send PUT request for each bank (or batch update if supported by backend)
      for (const bank of updatedBanks) {
        await fetchWithAuth(`/investor/banks/${bank.bank_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            account_no: bank.account_no,
            ifsc: bank.ifsc,
            branch: bank.branch,
            is_default: bank.is_default,
          }),
        });
      }
      setBanks(updatedBanks);
    } catch (err) {
      setError("Failed to set default bank: " + err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Bank Mandates</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="bg-white shadow rounded p-6">
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Add Bank</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <input
              placeholder="Account (last 4)"
              value={form.account}
              onChange={(e) => setForm({ ...form, account: e.target.value })}
              className="input"
            />
            <input
              placeholder="IFSC"
              value={form.ifsc}
              onChange={(e) => setForm({ ...form, ifsc: e.target.value })}
              className="input"
            />
            <input
              placeholder="Branch"
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
              className="input"
            />
          </div>
          <div className="mt-3">
            <button onClick={addBank} className="bg-blue-600 text-white px-4 py-2 rounded">
              Add Bank
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Linked Banks</h3>
          <div className="space-y-3">
            {banks.map((b) => (
              <div key={b.bank_id} className="flex items-center justify-between border p-3 rounded">
                <div>
                  <div className="font-semibold">Acct: {b.account_no}</div>
                  <div className="text-sm text-gray-500">{b.ifsc} — {b.branch}</div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={b.is_default}
                      onChange={() => setDefault(b.bank_id)}
                    />
                    <span className="text-sm">Default</span>
                  </label>
                  <button
                    onClick={() => removeBank(b.bank_id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
