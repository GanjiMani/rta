import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";

function downloadCSV(filename, rows) {
  if (!rows || !rows.length) return;
  const csv = [
    Object.keys(rows[0]).join(","),
    ...rows.map((r) => Object.values(r).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function CapitalGainsReport() {
  const { token } = useAuth();
  const [year, setYear] = useState("2024-25");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/investor/investor/capital-gains-stored?year=${year}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to load capital gains");
        const jsonResponse = await response.json();
        setData(jsonResponse);
      } catch (e) {
        alert(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [year, token]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <p className="text-center text-gray-700 py-6">Loading capital gains report...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Capital Gains Report</h2>
      <div className="bg-white shadow rounded p-6">
        <div className="flex gap-3 items-center mb-4">
          <label className="text-sm font-medium" htmlFor="financialYear">
            Financial Year
          </label>
          <select
            id="financialYear"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option>2025-26</option>
            <option>2024-25</option>
            <option>2023-24</option>
            <option>2022-23</option>
          </select>
          <button
            onClick={() => downloadCSV(`capital_gains_${year}.csv`, data)}
            className={`ml-auto px-4 py-2 rounded text-white ${
              data.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={data.length === 0}
            aria-disabled={data.length === 0}
          >
            Download CSV
          </button>
        </div>

        {data.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No capital gains data available for {year}.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border" role="table">
              <thead className="bg-gray-100">
                <tr>
                  {Object.keys(data[0]).map((key, idx) => (
                    <th key={idx} className="p-2 border" scope="col">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((record, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {Object.values(record).map((val, i) => (
                      <td key={i} className="p-2 border">
                        {val}
                      </td>
                    ))}
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
