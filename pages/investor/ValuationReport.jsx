import React, { useEffect, useState } from "react";
import { useAuth } from "../../services/AuthContext";

export default function ValuationReport() {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHoldings() {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/investor/investor/valuation-report", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to load valuation data");
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchHoldings();
  }, [token]);

  const downloadCSV = () => {
    if (!data.length) return;
    const rows = data.map((d) => ({
      Scheme: d.scheme,
      Folio: d.folio || "",
      Units: d.units,
      NAV: d.nav,
      Value: d.value,
    }));
    const csv = [Object.keys(rows[0]).join(","), ...rows.map((r) => Object.values(r).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "valuation_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading valuation data...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Valuation Report</h2>
      <div className="bg-white shadow rounded p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">Snapshot as of {new Date().toISOString().slice(0, 10)}</p>
          <button
            onClick={downloadCSV}
            className={`bg-blue-600 text-white px-4 py-2 rounded ${data.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
            disabled={data.length === 0}
            aria-disabled={data.length === 0}
          >
            Download CSV
          </button>
        </div>

        {data.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No holdings data available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Scheme</th>
                  <th className="p-2 border">Folio</th>
                  <th className="p-2 border">Units</th>
                  <th className="p-2 border">NAV (₹)</th>
                  <th className="p-2 border">Value (₹)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((h, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-2 border">{h.scheme}</td>
                    <td className="p-2 border">{h.folio}</td>
                    <td className="p-2 border">{h.units}</td>
                    <td className="p-2 border">₹{h.nav}</td>
                    <td className="p-2 border font-semibold">₹{h.value.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
