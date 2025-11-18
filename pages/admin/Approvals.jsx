import { useState } from "react";
import { CheckCircle, XCircle, Filter, Search, Eye } from "lucide-react";

export default function Approvals() {
  // Dummy transactions (later replace with API)
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      investor: "John Doe",
      pan: "ABCDE1234F",
      scheme: "ABC Equity Fund",
      type: "Purchase",
      amount: 5000,
      date: "2025-09-15",
      status: "Pending",
      folio: "1234567890",
      bank: "HDFC Bank - 1234",
      nominee: "Jane Doe",
    },
    {
      id: 2,
      investor: "Priya Sharma",
      pan: "PQRSX5678Z",
      scheme: "XYZ Debt Fund",
      type: "Redemption",
      amount: 2000,
      date: "2025-09-16",
      status: "Pending",
      folio: "9876543210",
      bank: "ICICI Bank - 5678",
      nominee: "Ravi Sharma",
    },
    {
      id: 3,
      investor: "Amit Kumar",
      pan: "LMNOP3456K",
      scheme: "Balanced Advantage",
      type: "SIP",
      amount: 1000,
      date: "2025-09-17",
      status: "Approved",
      folio: "6543219870",
      bank: "SBI Bank - 4321",
      nominee: "Seema Kumar",
    },
  ]);

  const [selected, setSelected] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewTxn, setViewTxn] = useState(null); // modal state

  const handleAction = (ids, action) => {
    setTransactions((prev) =>
      prev.map((txn) =>
        ids.includes(txn.id)
          ? { ...txn, status: action === "approve" ? "Approved" : "Rejected" }
          : txn
      )
    );
    setSelected([]); // clear selection
    setViewTxn(null); // close modal if open
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filteredTransactions.length) {
      setSelected([]);
    } else {
      setSelected(filteredTransactions.map((txn) => txn.id));
    }
  };

  // Apply search + filter
  const filteredTransactions = transactions.filter((txn) => {
    const matchesStatus =
      statusFilter === "All" || txn.status === statusFilter;
    const matchesSearch =
      txn.investor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.pan.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Approvals</h1>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Search */}
        <div className="flex items-center px-3 py-2 border rounded-md bg-white">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by Name or PAN"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none w-48"
          />
        </div>

        {/* Bulk Actions */}
        {selected.length > 0 && (
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => handleAction(selected, "approve")}
              className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4" /> Approve Selected
            </button>
            <button
              onClick={() => handleAction(selected, "reject")}
              className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <XCircle className="w-4 h-4" /> Reject Selected
            </button>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={
                    selected.length > 0 &&
                    selected.length === filteredTransactions.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-2">Investor</th>
              <th className="px-4 py-2">PAN</th>
              <th className="px-4 py-2">Scheme</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn) => (
              <tr key={txn.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(txn.id)}
                    onChange={() => toggleSelect(txn.id)}
                  />
                </td>
                <td className="px-4 py-2">{txn.investor}</td>
                <td className="px-4 py-2">{txn.pan}</td>
                <td className="px-4 py-2">{txn.scheme}</td>
                <td className="px-4 py-2">{txn.type}</td>
                <td className="px-4 py-2">₹{txn.amount.toLocaleString()}</td>
                <td className="px-4 py-2">{txn.date}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    txn.status === "Approved"
                      ? "text-green-600"
                      : txn.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {txn.status}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => setViewTxn(txn)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                  <button
                    onClick={() => handleAction([txn.id], "approve")}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleAction([txn.id], "reject")}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Transaction Details Modal */}
      {viewTxn && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              Transaction Details
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Investor:</strong> {viewTxn.investor}</li>
              <li><strong>PAN:</strong> {viewTxn.pan}</li>
              <li><strong>Folio:</strong> {viewTxn.folio}</li>
              <li><strong>Scheme:</strong> {viewTxn.scheme}</li>
              <li><strong>Type:</strong> {viewTxn.type}</li>
              <li><strong>Amount:</strong> ₹{viewTxn.amount.toLocaleString()}</li>
              <li><strong>Date:</strong> {viewTxn.date}</li>
              <li><strong>Status:</strong> {viewTxn.status}</li>
              <li><strong>Bank:</strong> {viewTxn.bank}</li>
              <li><strong>Nominee:</strong> {viewTxn.nominee}</li>
            </ul>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => handleAction([viewTxn.id], "approve")}
                className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button
                onClick={() => handleAction([viewTxn.id], "reject")}
                className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button
                onClick={() => setViewTxn(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
