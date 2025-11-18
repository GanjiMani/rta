import React, { useState } from "react";

// Dummy data: AMC Report vs RTA Processed Transactions
const dummyReconciliationData = [
  {
    Transaction_ID: "T001",
    Folio_Number: "F001",
    Investor_Name: "Rohan Sharma",
    PAN: "ABCDE1234F",
    AMC_Name: "Visionary Mutual Fund",
    Scheme_Name: "Visionary Bluechip Fund",
    Transaction_Type: "Fresh Purchase",
    AMC_Amount: 10000,
    RTA_Amount: 10000,
    Units: 40,
    NAV_per_Unit: 250,
    Status: "Matched",
    Processed_By: "Admin",
    Transaction_Date: "2024-06-25",
    Remarks: ""
  },
  {
    Transaction_ID: "T002",
    Folio_Number: "F002",
    Investor_Name: "Priya Singh",
    PAN: "FGHIJ5678K",
    AMC_Name: "Progressive AMC",
    Scheme_Name: "Progressive Midcap Fund",
    Transaction_Type: "Fresh Purchase",
    AMC_Amount: 20000,
    RTA_Amount: 19800,
    Units: 250,
    NAV_per_Unit: 80,
    Status: "Discrepancy",
    Processed_By: "Admin",
    Transaction_Date: "2024-07-01",
    Remarks: "Short by 200"
  },
  {
    Transaction_ID: "T003",
    Folio_Number: "F003",
    Investor_Name: "Alok Kumar",
    PAN: "KLMNO9012P",
    AMC_Name: "Visionary Mutual Fund",
    Scheme_Name: "Visionary Liquid Fund",
    Transaction_Type: "Redemption",
    AMC_Amount: 10500,
    RTA_Amount: 10500,
    Units: 10,
    NAV_per_Unit: 1050,
    Status: "Matched",
    Processed_By: "Admin",
    Transaction_Date: "2024-08-01",
    Remarks: ""
  },
  {
    Transaction_ID: "T004",
    Folio_Number: "F004",
    Investor_Name: "Neha Gupta",
    PAN: "PQRST3456U",
    AMC_Name: "Horizon Fund House",
    Scheme_Name: "Horizon Debt Fund",
    Transaction_Type: "IDCW Payout",
    AMC_Amount: 150,
    RTA_Amount: 0,
    Units: 100,
    NAV_per_Unit: 1.5,
    Status: "Pending",
    Processed_By: "-",
    Transaction_Date: "2024-10-01",
    Remarks: "Unprocessed payout"
  },
];

const statuses = ["All", "Matched", "Pending", "Discrepancy"];
const transactionTypes = ["All", ...new Set(dummyReconciliationData.map(tx => tx.Transaction_Type))];

const recordsPerPage = 10;

export default function Reconciliation() {
  const [records, setRecords] = useState(dummyReconciliationData);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRecords = records.filter((tx) => {
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

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const exportCSV = () => {
    const csvData = [
      [
        "Transaction ID",
        "Folio Number",
        "Investor Name",
        "PAN",
        "AMC Name",
        "Scheme Name",
        "Transaction Type",
        "AMC Amount",
        "RTA Amount",
        "Units",
        "NAV per Unit",
        "Status",
        "Processed By",
        "Transaction Date",
        "Remarks",
      ],
      ...filteredRecords.map((tx) => [
        tx.Transaction_ID,
        tx.Folio_Number,
        tx.Investor_Name,
        tx.PAN,
        tx.AMC_Name,
        tx.Scheme_Name,
        tx.Transaction_Type,
        tx.AMC_Amount,
        tx.RTA_Amount,
        tx.Units,
        tx.NAV_per_Unit,
        tx.Status,
        tx.Processed_By,
        tx.Transaction_Date,
        tx.Remarks,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reconciliation_records.csv";
    a.click();
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case "Matched":
        return "text-green-600 font-semibold";
      case "Pending":
        return "text-yellow-600 font-semibold";
      case "Discrepancy":
        return "text-red-600 font-semibold";
      default:
        return "";
    }
  };

  return (
    <main className="p-6 max-w-full" role="main" aria-label="Reconciliation Records">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Reconciliation</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Folio, Investor, PAN, AMC, Scheme"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-2 flex-1 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Search records"
        />
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by transaction type"
        >
          {transactionTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by status"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          onClick={exportCSV}
          className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          aria-label="Export filtered reconciliation records as CSV"
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md" role="table" aria-label="Reconciliation Records Table">
          <thead>
            <tr className="bg-blue-100 text-blue-700">
              {[
                "Transaction ID",
                "Folio Number",
                "Investor Name",
                "PAN",
                "AMC Name",
                "Scheme Name",
                "Transaction Type",
                "AMC Amount",
                "RTA Amount",
                "Units",
                "NAV per Unit",
                "Status",
                "Processed By",
                "Transaction Date",
                "Remarks",
              ].map((col) => (
                <th key={col} className="px-4 py-2 text-left text-sm font-semibold border-b">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan="15" className="text-center py-6 text-gray-500">
                  No records found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((tx, idx) => (
                <tr key={tx.Transaction_ID} className="hover:bg-gray-50 text-black">
                  <td className="px-4 py-2 border-b">{tx.Transaction_ID}</td>
                  <td className="px-4 py-2 border-b">{tx.Folio_Number}</td>
                  <td className="px-4 py-2 border-b">{tx.Investor_Name}</td>
                  <td className="px-4 py-2 border-b">{tx.PAN}</td>
                  <td className="px-4 py-2 border-b">{tx.AMC_Name}</td>
                  <td className="px-4 py-2 border-b">{tx.Scheme_Name}</td>
                  <td className="px-4 py-2 border-b">{tx.Transaction_Type}</td>
                  <td className="px-4 py-2 border-b">{tx.AMC_Amount.toLocaleString()}</td>
                  <td className="px-4 py-2 border-b">{tx.RTA_Amount.toLocaleString()}</td>
                  <td className="px-4 py-2 border-b">{tx.Units}</td>
                  <td className="px-4 py-2 border-b">{tx.NAV_per_Unit}</td>
                  <td className={`px-4 py-2 border-b ${getStatusClassName(tx.Status)}`}>{tx.Status}</td>
                  <td className="px-4 py-2 border-b">{tx.Processed_By}</td>
                  <td className="px-4 py-2 border-b">{new Date(tx.Transaction_Date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border-b">{tx.Remarks}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredRecords.length > recordsPerPage && (
        <div className="flex justify-center gap-3 py-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="mt-4 flex gap-6 flex-wrap">
        <p className="text-black text-sm font-medium">
          Total Records: {filteredRecords.length}
        </p>
        <p className="text-black text-sm font-medium">
          Total AMC Amount: ₹{filteredRecords.reduce((sum, tx) => sum + tx.AMC_Amount, 0).toLocaleString()}
        </p>
        <p className="text-black text-sm font-medium">
          Total RTA Amount: ₹{filteredRecords.reduce((sum, tx) => sum + tx.RTA_Amount, 0).toLocaleString()}
        </p>
      </div>
    </main>
  );
}
