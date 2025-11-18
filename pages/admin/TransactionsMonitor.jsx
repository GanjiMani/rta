import React, { useState } from "react";

export default function TransactionsMonitor() {
  const initialTransactions = [
    {
      Transaction_ID: "T001",
      Folio_Number: "F001",
      Investor_Name: "Rohan Sharma",
      PAN: "ABCDE1234F",
      AMC_Name: "Visionary Mutual Fund",
      Scheme_Name: "Visionary Bluechip Fund",
      Transaction_Type: "Fresh Purchase",
      Amount: 10000,
      Units: 40,
      NAV_per_Unit: 250,
      Status: "Completed",
      Processed_By: "Admin",
      Transaction_Date: "2024-06-25"
    },
    {
      Transaction_ID: "T002",
      Folio_Number: "F001",
      Investor_Name: "Rohan Sharma",
      PAN: "ABCDE1234F",
      AMC_Name: "Visionary Mutual Fund",
      Scheme_Name: "Visionary Bluechip Fund",
      Transaction_Type: "Add Purchase",
      Amount: 5000,
      Units: 19.2308,
      NAV_per_Unit: 260,
      Status: "Completed",
      Processed_By: "Admin",
      Transaction_Date: "2024-07-01"
    },
    // Add more dummy transactions
  ];

  const [transactions, setTransactions] = useState(initialTransactions);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");

  const filteredTransactions = transactions.filter(tx =>
    (filterStatus === "All" || tx.Status === filterStatus) &&
    (filterType === "All" || tx.Transaction_Type === filterType) &&
    (tx.Folio_Number.toLowerCase().includes(search.toLowerCase()) ||
     tx.Investor_Name.toLowerCase().includes(search.toLowerCase()) ||
     tx.PAN.toLowerCase().includes(search.toLowerCase()) ||
     tx.AMC_Name.toLowerCase().includes(search.toLowerCase()) ||
     tx.Scheme_Name.toLowerCase().includes(search.toLowerCase()))
  );

  const transactionTypes = ["All", ...new Set(transactions.map(tx => tx.Transaction_Type))];
  const statuses = ["All", "Pending", "Completed", "Failed"];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Transactions Monitor</h1>

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
                "Transaction_Date"
              ].map(col => (
                <th key={col} className="px-4 py-2 text-left text-sm font-semibold text-blue-700 border-b">{col.replace(/_/g," ")}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(tx => (
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
                <td className="px-4 py-2 border-b">{tx.Transaction_Date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
