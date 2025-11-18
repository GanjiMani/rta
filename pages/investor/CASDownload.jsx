import React, { useState } from "react";

export default function CASDownload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [year, setYear] = useState("2024-25");

  const handleDownload = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`/api/cas/generate-excel?year=${year}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // update as needed
        },
      });
      if (!response.ok) throw new Error("Failed to generate the CAS Excel document.");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CAS_${year}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError("Failed to generate the CAS document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Consolidated Account Statement (CAS)</h2>
      <div className="bg-white shadow rounded p-6">
        <p className="text-gray-600 mb-4">
          Download your consolidated statement for all folios serviced by this RTA.
        </p>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="mb-4 border rounded p-2"
        >
          <option>2025-26</option>
          <option>2024-25</option>
          <option>2023-24</option>
          <option>2022-23</option>
        </select>
        {error && <p className="text-red-600 mb-3">{error}</p>}
        <button
          onClick={handleDownload}
          disabled={loading}
          aria-label="Download Consolidated Account Statement"
          className={`bg-blue-600 text-white px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Generating..." : "Download CAS (Excel)"}
        </button>
      </div>
    </div>
  );
}
