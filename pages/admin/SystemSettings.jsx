import React, { useState, useEffect } from "react";

const initialSettings = [
  { key: "Transaction Cutoff Time", value: "17:00", description: "Time after which transactions are processed next day" },
  { key: "NAV Calculation Time", value: "20:00", description: "Time at which NAV is calculated daily" },
  { key: "Max SIP Amount", value: "100000", description: "Maximum allowed SIP amount per transaction" },
];

const validateTime = (time) => /^\d{2}:\d{2}$/.test(time);

const isValidSetting = (setting) => {
  if (setting.key.includes("Time")) return validateTime(setting.value);
  if (setting.key === "Max SIP Amount") return !isNaN(setting.value) && Number(setting.value) > 0;
  return true;
};

export default function SystemSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [originalSettings, setOriginalSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleValueChange = (index, newValue) => {
    setSettings((prevSettings) => {
      const updated = [...prevSettings];
      updated[index] = { ...updated[index], value: newValue };
      return updated;
    });
    setMessage(null);
  };

  const allValid = settings.every(isValidSetting);

  const handleSave = () => {
    if (!allValid) return;
    setSaving(true);
    setMessage(null);
    // Simulate API save delay
    setTimeout(() => {
      setOriginalSettings(settings);
      setSaving(false);
      setMessage({ type: "success", text: "System settings saved successfully." });
    }, 1000);
  };

  const handleReset = () => {
    setSettings(originalSettings);
    setMessage(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">System Settings</h1>

      {message && (
        <div
          role="alert"
          className={`mb-4 p-3 rounded ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-blue-100 text-blue-700">
              {["Setting", "Value", "Description"].map((col) => (
                <th key={col} className="px-4 py-3 text-left text-sm font-semibold border-b">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {settings.map((setting, index) => {
              const valid = isValidSetting(setting);
              return (
                <tr key={setting.key} className="hover:bg-gray-50 text-black">
                  <td className="px-4 py-3 border-b">{setting.key}</td>
                  <td className="px-4 py-3 border-b">
                    <input
                      id={`setting-${index}`}
                      type="text"
                      aria-describedby={`desc-${index}`}
                      className={`w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        valid ? "" : "border-red-500 bg-red-50"
                      }`}
                      value={setting.value}
                      onChange={(e) => handleValueChange(index, e.target.value)}
                    />
                    {!valid && (
                      <p role="alert" className="text-red-600 text-xs mt-1">
                        {setting.key.includes("Time")
                          ? "Invalid time format (HH:mm expected)"
                          : setting.key === "Max SIP Amount"
                          ? "Must be a positive number"
                          : "Invalid value"}
                      </p>
                    )}
                  </td>
                  <td id={`desc-${index}`} className="px-4 py-3 border-b text-gray-600 text-sm">
                    {setting.description}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSave}
          disabled={saving || !allValid}
          className={`px-5 py-2 rounded text-white ${
            saving || !allValid ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          aria-busy={saving}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>

        <button
          onClick={handleReset}
          disabled={saving}
          className="px-5 py-2 rounded border border-gray-300 hover:bg-gray-100"
        >
          Reset Changes
        </button>
      </div>
    </div>
  );
}
