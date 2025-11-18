import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";

function maskPhone(phone) {
  if (!phone || phone.length < 4) return phone;
  return phone.slice(0, 5) + "****" + phone.slice(-2);
}

function maskEmail(email) {
  if (!email) return "";
  const [user, domain] = email.split("@");
  const maskedUser = user.length <= 2 ? user[0] + "*" : user.slice(0, 2) + "...";
  return maskedUser + "@" + domain;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ClientList() {
  const { fetchWithAuth } = useAuth();
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setError("");
    try {
      const res = await fetchWithAuth(`/investor/clients`);
      if (!res.ok) throw new Error("Failed to fetch clients");
      const data = await res.json();
      setClients(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Your Agents / Mediators</h2>

      {error && <p className="mb-4 text-red-600 font-semibold">{error}</p>}

      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-4 py-2 border rounded w-full max-w-md"
      />

      {filteredClients.length === 0 ? (
        <p>No agents found.</p>
      ) : (
        <div className="space-y-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="p-4 bg-white rounded shadow flex flex-col md:flex-row md:justify-between items-start md:items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{client.name}</h3>
                <p>Email: {maskEmail(client.email)}</p>
                <p>Phone: {maskPhone(client.phone)}</p>
              </div>
              <div className="mt-2 md:mt-0 text-right">
                <p className="font-semibold">Commission Earned</p>
                <p>₹{client.total_commission.toLocaleString()}</p>
                <p
                  className={`mt-1 inline-block px-2 py-1 rounded text-white ${
                    client.active ? "bg-green-600" : "bg-gray-600"
                  }`}
                >
                  {client.active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
