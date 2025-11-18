import React, { useState } from "react";

export default function UnclaimedFundsManagement() {
  const initialUnclaimed = [
    {
      Transaction_ID: "U001",
      Folio_Number: "F004",
      Investor_Name: "Neha Gupta",
      PAN: "PQRST3456U",
      AMC_Name: "Horizon Fund House",
      Scheme_Name: "Horizon Debt Fund",
      Transaction_Type: "IDCW Payout",
      Amount: 150,
      Units: 0,
      NAV_per_Unit: 1050,
      Status: "Pending",
      Processed_By: "-",
      Unclaimed_Since: "2024-10-01",
      Reference_ID: "UC001"
    },
    {
      Transaction_ID: "U002",
      Folio_Number: "F002",
      Investor_Name: "Priya Singh",
      PAN: "FGHIJ5678K",
      AMC_Name: "Progressive AMC",
      Scheme_Name: "Progressive Midcap Fund",
      Transaction_Type: "Redemption",
      Amount: 2000,
      Units: 25,
      NAV_per_Unit: 80,
      Status: "Pending",
      Processed_By: "-",
      Unclaimed_Since: "2024-09-10",
      Reference_ID: "UC002"
    },
  ];

  const [unclaimed, setUnclaimed] = useState(initialUnclaimed);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");

  // Mark as Released
  const handleRelease = (id) => {
    setUnclaimed(unclaimed.map(tx =>
      tx.Transaction_ID === id
        ? { ...tx, Status: "Released", Processed_By: "Admin" }
        : tx
    ));
    alert(`Unclaimed transaction ${id} marked as Released.`);
  };

  const filteredUnclaimed = unclaimed.filter(tx => {
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

  const transactionTypes = ["All", ...new Set(unclaimed.map(tx => tx.Transaction_Type))];
  const statuses = ["All", "Pending", "Released"];

  // Summary
  const totalAmount = filteredUnclaimed.reduce((sum, tx) => sum + tx.Amount, 0);
  const totalUnits = filteredUnclaimed.reduce((sum, tx) => sum + tx.Units, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Unclaimed Funds Management</h1>

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

      {/* Table */}
      <div className="overflow-x-auto">
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
                "Amount",
                "Units",
                "NAV_per_Unit",
                "Status",
                "Processed_By",
                "Unclaimed_Since",
                "Reference_ID",
                "Actions"
              ].map(col => (
                <th key={col} className="px-4 py-2 text-left text-sm font-semibold text-blue-700 border-b">{col.replace(/_/g," ")}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUnclaimed.map(tx => (
              <tr key={tx.Transaction_ID} className="hover:bg-gray-50 text-black">
                <td className="px-4 py-2 border-b">{tx.Transaction_ID}</td>
                <td className="px-4 py-2 border-b">{tx.Folio_Number}</td>
                <td className="px-4 py-2 border-b">{tx.Investor_Name}</td>
                <td className="px-4 py-2 border-b">{tx.PAN}</td>
                <td className="px-4 py-2 border-b">{tx.AMC_Name}</td>
                <td className="px-4 py-2 border-b">{tx.Scheme_Name}</td>
                <td className="px-4 py-2 border-b">{tx.Transaction_Type}</td>
                <td className="px-4 py-2 border-b">{tx.Amount.toLocaleString()}</td>
                <td className="px-4 py-2 border-b">{tx.Units}</td>
                <td className="px-4 py-2 border-b">{tx.NAV_per_Unit}</td>
                <td className="px-4 py-2 border-b">{tx.Status}</td>
                <td className="px-4 py-2 border-b">{tx.Processed_By}</td>
                <td className="px-4 py-2 border-b">{tx.Unclaimed_Since}</td>
                <td className="px-4 py-2 border-b">{tx.Reference_ID}</td>
                <td className="px-4 py-2 border-b">
                  {tx.Status === "Pending" ? (
                    <button onClick={() => handleRelease(tx.Transaction_ID)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Release</button>
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
      <div className="mt-4 flex gap-6">
        <p className="text-black text-sm font-medium">Total Amount: ₹{totalAmount.toLocaleString()}</p>
        <p className="text-black text-sm font-medium">Total Units: {totalUnits}</p>
      </div>
    </div>
  );
}
