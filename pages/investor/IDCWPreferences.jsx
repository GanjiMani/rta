import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";

export default function IDCWPreferences({ schemes = [] }) {
  const { token } = useAuth();

  const initial = schemes.length
    ? schemes.map((s) => ({ name: s.name, preference: s.preference || "Payout" }))
    : [
        { name: "ABC Equity Fund", preference: "Reinvest" },
        { name: "XYZ Debt Fund", preference: "Payout" },
        { name: "Balanced Advantage", preference: "Payout" },
      ];

  const [prefs, setPrefs] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Load existing IDCW preferences from backend on mount
  useEffect(() => {
    async function fetchPreferences() {
      try {
        const response = await fetch("http://localhost:8000/investor/idcw-preferences", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to load preferences");
        const data = await response.json();
        if (data && data.length) {
          // Map backend scheme_id to name if needed, assume scheme_id === name here
          setPrefs(
            data.map((p) => ({
              name: p.scheme_id,
              preference: p.preference,
            }))
          );
        }
      } catch (error) {
        setError(error.message);
      }
    }
    fetchPreferences();
  }, [token]);

  const handleChange = (idx, val) => {
    const copy = [...prefs];
    copy[idx].preference = val;
    setPrefs(copy);
    setSaved(false);
  };

  const handleSave = async () => {
    setError("");
    try {
      const payload = prefs.map((p) => ({
        scheme_id: p.name, // Adjust if you use different ids
        preference: p.preference,
      }));
      const response = await fetch("http://localhost:8000/investor/idcw-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to save preferences");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">IDCW Preferences</h2>
      <div className="bg-white shadow rounded p-6">
        <p className="text-sm text-gray-600 mb-4">Choose dividend option for each scheme</p>
        {error && <p className="text-red-600 mb-3">{error}</p>}
        <div className="space-y-3">
          {prefs.map((p, i) => (
            <div key={i} className="flex items-center justify-between border rounded p-3">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-500">Select Payout or Reinvestment</div>
              </div>
              <div className="flex gap-3 items-center">
                <select
                  value={p.preference}
                  onChange={(e) => handleChange(i, e.target.value)}
                  className="border px-3 py-2 rounded"
                >
                  <option value="Payout">Payout</option>
                  <option value="Reinvest">Reinvest</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Preferences
          </button>
          {saved && <div className="text-green-600 self-center">Saved ✅</div>}
        </div>
      </div>
    </div>
  );
}
