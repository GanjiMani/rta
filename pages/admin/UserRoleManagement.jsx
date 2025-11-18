import React, { useState } from "react";

// Dummy user data
const dummyUsers = [
  { User_ID: "U001", Name: "RTA CEO", Email: "ceo@rta.com", Role: "CEO", Access_Level: "Full Control", Status: "Active", Created_On: "2025-01-01", Last_Login: "2025-09-18 09:00" },
  { User_ID: "U002", Name: "Operations Manager", Email: "opsmgr@rta.com", Role: "Operations Manager", Access_Level: "Read-Write Operational", Status: "Active", Created_On: "2025-02-15", Last_Login: "2025-09-18 10:15" },
  { User_ID: "U003", Name: "Compliance Head", Email: "compliance@rta.com", Role: "Compliance Head", Access_Level: "Read + Limited Compliance", Status: "Active", Created_On: "2025-03-10", Last_Login: "2025-09-17 18:45" },
  { User_ID: "U004", Name: "Senior Executive", Email: "senior@rta.com", Role: "Senior Executive", Access_Level: "Portfolio + Transaction DB", Status: "Inactive", Created_On: "2025-04-05", Last_Login: "2025-07-12 11:00" },
  { User_ID: "U005", Name: "Customer Service", Email: "cs@rta.com", Role: "Customer Service", Access_Level: "Read-only Portfolio", Status: "Active", Created_On: "2025-05-01", Last_Login: "2025-09-18 08:50" },
];

export default function UserRoleManagement() {
  const [users, setUsers] = useState(dummyUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Filtered users
  const filteredUsers = users.filter((user) => {
    return (
      (filterRole === "All" || user.Role === filterRole) &&
      (filterStatus === "All" || user.Status === filterStatus) &&
      (user.Name.toLowerCase().includes(search.toLowerCase()) ||
       user.Email.toLowerCase().includes(search.toLowerCase()) ||
       user.User_ID.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const roles = ["All", ...new Set(users.map((u) => u.Role))];
  const statuses = ["All", "Active", "Inactive"];

  // Dummy action handlers
  const toggleStatus = (userId) => {
    setUsers(prev =>
      prev.map(u =>
        u.User_ID === userId
          ? { ...u, Status: u.Status === "Active" ? "Inactive" : "Active" }
          : u
      )
    );
  };

  const editUser = (userId) => {
    alert(`Edit User: ${userId} (dummy action)`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-blue-700">User Role Management</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Name, Email, or User ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {roles.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-blue-100">
              {[
                "User_ID", "Name", "Email", "Role", "Access_Level", "Status", "Created_On", "Last_Login", "Actions"
              ].map((col) => (
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
            {filteredUsers.map((user) => (
              <tr key={user.User_ID} className="hover:bg-gray-50 text-black">
                <td className="px-4 py-2 border-b">{user.User_ID}</td>
                <td className="px-4 py-2 border-b">{user.Name}</td>
                <td className="px-4 py-2 border-b">{user.Email}</td>
                <td className="px-4 py-2 border-b">{user.Role}</td>
                <td className="px-4 py-2 border-b">{user.Access_Level}</td>
                <td className="px-4 py-2 border-b">{user.Status}</td>
                <td className="px-4 py-2 border-b">{user.Created_On}</td>
                <td className="px-4 py-2 border-b">{user.Last_Login}</td>
                <td className="px-4 py-2 border-b flex gap-2">
                  <button
                    onClick={() => editUser(user.User_ID)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleStatus(user.User_ID)}
                    className={`px-3 py-1 rounded text-sm ${
                      user.Status === "Active" ? "bg-red-600 text-white hover:bg-red-700" : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {user.Status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-4 flex gap-6">
        {statuses.filter(s => s !== "All").map(s => (
          <p key={s} className="text-black text-sm font-medium">
            {s} Users: {filteredUsers.filter(u => u.Status === s).length}
          </p>
        ))}
      </div>
    </div>
  );
}
