import React, { useState } from "react";

export default function IDCWManagement() {
  const initialIDCW = [
    {
      Transaction_ID: "T010",
      Folio_Number: "F004",
      Investor_Name: "Neha Gupta",
      PAN: "PQRST3456U",
      AMC_Name: "Horizon Fund House",
      Scheme_Name: "Horizon Debt Fund",
      Transaction_Type: "Payout",
      Units: 100,
      Amount: 150,
      NAV_per_Unit: 1.5,
      Status: "Pending",
      Processed_By: "-",
      Declaration_Date: "2024-10-01",
      Reference_ID: "IDCW001"
    },
    {
      Transaction_ID: "T011",
      Folio_Number: "F005",
      Investor_Name: "Vijay Patil",
      PAN: "VWXYZ7890A",
      AMC_Name: "Pinnacle Funds",
      Scheme_Name: "Pinnacle Hybrid Fund",
      Transaction_Type: "Reinvestment",
      Units: 200,
      Amount: 400,
      NAV_per_Unit: 2,
      Status: "Pending",
      Processed_By: "-",
      Declaration_Date: "2024-10-01",
      Reference_ID: "IDCW002"
    },
  ];

  const [idcws, setIdcws] = useState(initialIDCW);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");

  const handleProcess = (id) => {
    setIdcws(idcws.map(tx =>
      tx.Transaction_ID === id
        ? { ...tx, Status: "Completed", Processed_By: "Admin" }
        : tx
    ));
    alert(`IDCW transaction ${id} marked as processed.`);
  };

  const filteredIDCW = idcws.filter(tx => {
    return (
      (filterStatus === "All" || tx.Status === filterStatus) &&
      (filterType === "All" || tx.Transaction_Type === filterType) &&
      (tx.Folio_Number.toLowerCase().includes(search.toLowerCase()) ||
        tx.Investor_Name.toLowerCase().includes(search.toLowerCase()) ||
        tx.PAN.toLowerCase().includes(search.toLowerCase()) ||
        tx.AMC_Name.toLowerCase().includes(search.toLowerCase()) ||
        tx.Scheme_Name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const transactionTypes = ["All", ...new Set(idcws.map(tx => tx.Transaction_Type))];
  const statuses = ["All", "Pending", "Completed", "Failed"];

  const totalAmount = filteredIDCW.reduce((sum, tx) => sum + tx.Amount, 0);
  const totalUnits = filteredIDCW.reduce((sum, tx) => sum + tx.Units, 0);

  return (
    <div style={{ minWidth: 0 }}>
      <h1 className="text-2xl font-bold mb-6 text-blue-700">IDCW Management</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Folio, Investor, PAN, AMC, Scheme"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
          {transactionTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table Wrapping Div with minWidth to fix overflow */}
      <div className="overflow-x-auto max-w-full" style={{ minWidth: 0 }}>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-blue-100">
              {[
                "Transaction_ID",
                "Folio_Number",
                "Investor_Name",
                "PAN",
                "AMC_Name",
                "Scheme_Name",
                "Transaction_Type",
                "Units",
                "Amount",
                "NAV_per_Unit",
                "Status",
                "Processed_By",
                "Declaration_Date",
                "Reference_ID",
                "Actions"
              ].map(col => (
                <th
                  key={col}
                  className={`px-4 py-2 text-left text-sm font-semibold text-blue-700 border-b ${
                    ["AMC_Name", "Scheme_Name"].includes(col)
                      ? "hidden md:table-cell"
                      : ""
                  }`}
                >
                  {col.replace(/_/g," ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredIDCW.map(tx => (
              <tr key={tx.Transaction_ID} className="hover:bg-gray-50 text-black">
                <td className="px-4 py-2 border-b">{tx.Transaction_ID}</td>
                <td className="px-4 py-2 border-b">{tx.Folio_Number}</td>
                <td className="px-4 py-2 border-b">{tx.Investor_Name}</td>
                <td className="px-4 py-2 border-b">{tx.PAN}</td>
                <td className="px-4 py-2 border-b hidden md:table-cell">{tx.AMC_Name}</td>
                <td className="px-4 py-2 border-b hidden md:table-cell">{tx.Scheme_Name}</td>
                <td className="px-4 py-2 border-b">{tx.Transaction_Type}</td>
                <td className="px-4 py-2 border-b">{tx.Units}</td>
                <td className="px-4 py-2 border-b">{tx.Amount.toLocaleString()}</td>
                <td className="px-4 py-2 border-b">{tx.NAV_per_Unit}</td>
                <td className="px-4 py-2 border-b">{tx.Status}</td>
                <td className="px-4 py-2 border-b">{tx.Processed_By}</td>
                <td className="px-4 py-2 border-b">{tx.Declaration_Date}</td>
                <td className="px-4 py-2 border-b">{tx.Reference_ID}</td>
                <td className="px-4 py-2 border-b">
                  {tx.Status === "Pending" ? (
                    <button onClick={() => handleProcess(tx.Transaction_ID)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                      Process
                    </button>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 flex gap-6 flex-wrap">
        <p className="text-black text-sm font-medium">Total Amount: ₹{totalAmount.toLocaleString()}</p>
        <p className="text-black text-sm font-medium">Total Units: {totalUnits}</p>
      </div>
    </div>
  );
}
