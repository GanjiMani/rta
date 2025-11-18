import { useState, useEffect, useRef } from "react";
import { Search, Filter, Download } from "lucide-react";

const logsPerPage = 10;

export default function AuditLogs() {
  const [logs] = useState([
    { id: 1, user: "admin@rta.com", role: "Admin", action: "Approved Transaction #1234", timestamp: "2025-09-15 10:35:21", ip: "192.168.1.101" },
    { id: 2, user: "ops@amc.com", role: "AMC", action: "Generated Compliance Report", timestamp: "2025-09-15 09:15:47", ip: "192.168.1.205" },
    { id: 3, user: "investor1@example.com", role: "Investor", action: "Logged in", timestamp: "2025-09-14 19:22:05", ip: "192.168.1.150" },
    { id: 4, user: "admin@rta.com", role: "Admin", action: "Modified User Role", timestamp: "2025-09-14 14:02:33", ip: "192.168.1.101" },
    // add more logs if needed to test pagination
  ]);

  const [roleFilter, setRoleFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const searchTimeoutRef = useRef(null);

  // Debounce search input update
  useEffect(() => {
    setLoading(true);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on search change
      setLoading(false);
    }, 300);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchTerm]);

  const filteredLogs = logs.filter((log) => {
    const matchesRole = roleFilter === "All" || log.role === roleFilter;
    const matchesSearch =
      log.user.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      log.ip.includes(debouncedSearch);
    return matchesRole && matchesSearch;
  });

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage);

  const exportCSV = () => {
    const csvData = [
      ["User", "Role", "Action", "Timestamp", "IP"],
      ...filteredLogs.map((log) => [
        `"${log.user}"`,
        log.role,
        `"${log.action}"`,
        log.timestamp,
        log.ip,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audit_logs.csv";
    a.click();
  };

  const clearFilters = () => {
    setRoleFilter("All");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen" role="main" aria-label="Audit Logs">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Audit Logs</h1>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" aria-hidden="true" />
          <select
            aria-label="Filter by user role"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="AMC">AMC</option>
            <option value="Investor">Investor</option>
          </select>
        </div>

        <div className="flex items-center px-3 py-2 border rounded-md bg-white">
          <Search className="w-4 h-4 text-gray-400 mr-2" aria-hidden="true" />
          <input
            aria-label="Search user, action, or IP"
            type="text"
            placeholder="Search user, action, or IP"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none w-60"
          />
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto"
          aria-label="Export filtered audit logs as CSV"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>

        <button
          onClick={clearFilters}
          className="px-4 py-2 border rounded-md hover:bg-gray-200"
          aria-label="Clear role filter and search"
        >
          Clear Filters
        </button>
      </div>

      {loading ? (
        <div role="status" aria-live="polite">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left" role="table" aria-label="Audit logs table">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2" scope="col">User</th>
                <th className="px-4 py-2" scope="col">Role</th>
                <th className="px-4 py-2" scope="col">Action</th>
                <th className="px-4 py-2" scope="col">Timestamp</th>
                <th className="px-4 py-2" scope="col">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No logs found.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{log.user}</td>
                    <td className="px-4 py-2">{log.role}</td>
                    <td className="px-4 py-2">{log.action}</td>
                    <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-2">{log.ip}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="flex justify-center gap-2 py-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
