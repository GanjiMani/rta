import React, { useState } from "react";

// Dummy AMC + Scheme master database
const masterSchemes = [
  { AMC_ID: "A001", AMC_Name: "Visionary Mutual Fund", Scheme_ID: "S001", Scheme_Name: "Visionary Bluechip Fund" },
  { AMC_ID: "A001", AMC_Name: "Visionary Mutual Fund", Scheme_ID: "S002", Scheme_Name: "Visionary Liquid Fund" },
  { AMC_ID: "A002", AMC_Name: "Progressive AMC", Scheme_ID: "S003", Scheme_Name: "Progressive Midcap Fund" },
  { AMC_ID: "A003", AMC_Name: "Horizon Fund House", Scheme_ID: "S004", Scheme_Name: "Horizon Debt Fund" },
  { AMC_ID: "A004", AMC_Name: "Pinnacle Funds", Scheme_ID: "S005", Scheme_Name: "Pinnacle Hybrid Fund" },
  { AMC_ID: "A005", AMC_Name: "Star Capital MF", Scheme_ID: "S006", Scheme_Name: "Star Small Cap Fund" },
];

export default function NAVUpload() {
  const [file, setFile] = useState(null);
  const [navs, setNavs] = useState([]);
  const [search, setSearch] = useState("");
  const [filterAMC, setFilterAMC] = useState("All");

  // Dummy parse function to simulate CSV/Excel upload
  const handleUpload = () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    // Simulate reading rows from CSV
    const dummyUploadData = [
      { AMC_Name: "Visionary Mutual Fund", Scheme_Name: "Visionary Bluechip Fund", NAV: 262, Effective_Date: "2024-08-01", Uploaded_By: "Admin", Status: "Pending" },
      { AMC_Name: "Progressive AMC", Scheme_Name: "Progressive Midcap Fund", NAV: 82, Effective_Date: "2024-08-01", Uploaded_By: "Admin", Status: "Pending" },
      { AMC_Name: "Horizon Fund House", Scheme_Name: "Horizon Debt Fund", NAV: 1055, Effective_Date: "2024-08-01", Uploaded_By: "Admin", Status: "Pending" },
    ];

    // Validate against master scheme list
    const validated = dummyUploadData.map((row) => {
      const exists = masterSchemes.find(
        (s) => s.AMC_Name === row.AMC_Name && s.Scheme_Name === row.Scheme_Name
      );
      return exists ? row : { ...row, Status: "Failed: Invalid AMC/Scheme" };
    });

    setNavs(validated);
    setFile(null);
    alert("NAV file processed. Check table for details.");
  };

  // Filter NAVs based on search and AMC
  const filteredNavs = navs.filter((row) => {
    return (
      (filterAMC === "All" || row.AMC_Name === filterAMC) &&
      (row.Scheme_Name.toLowerCase().includes(search.toLowerCase()) ||
        row.AMC_Name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const amcList = ["All", ...new Set(navs.map((row) => row.AMC_Name))];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-blue-700">NAV Upload</h1>

      {/* Upload Section */}
      <div className="mb-4 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border px-3 py-2 rounded focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upload
        </button>
        <button
          className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
          onClick={() => alert("Download template (dummy action)")}
        >
          Download Template
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Scheme or AMC"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={filterAMC}
          onChange={(e) => setFilterAMC(e.target.value)}
          className="border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {amcList.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-blue-100">
              {["AMC_Name", "Scheme_Name", "NAV", "Effective_Date", "Uploaded_By", "Status"].map((col) => (
                <th
                  key={col}
                  className="px-4 py-2 text-left text-sm font-semibold text-blue-700 border-b"
                >
                  {col.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredNavs.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 text-black">
                <td className="px-4 py-2 border-b">{row.AMC_Name}</td>
                <td className="px-4 py-2 border-b">{row.Scheme_Name}</td>
                <td className="px-4 py-2 border-b">{row.NAV}</td>
                <td className="px-4 py-2 border-b">{row.Effective_Date}</td>
                <td className="px-4 py-2 border-b">{row.Uploaded_By}</td>
                <td className="px-4 py-2 border-b">{row.Status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 flex gap-6">
        <p className="text-black text-sm font-medium">Total NAV Records: {filteredNavs.length}</p>
      </div>
    </div>
  );
}
