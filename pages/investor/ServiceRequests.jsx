import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ServiceRequests() {
  const { fetchWithAuth } = useAuth();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [type, setType] = useState("Change of Address");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setError("");
    try {
      const res = await fetchWithAuth(`/investor/service-requests`);
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const raise = async () => {
    if (!details) {
      alert("Enter details");
      return;
    }
    setError("");
    try {
      const payload = {
        type,
        details,
        created: new Date().toISOString().slice(0, 10),
      };

      const res = await fetchWithAuth(`/investor/service-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to raise request");
      }
      const newReq = await res.json();
      setRequests([newReq, ...requests]);
      setDetails("");
      alert("Request submitted successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  const openRequest = (request) => {
    setSelectedRequest(request);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedRequest(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Service Requests</h2>

      {error && <p className="mb-4 text-red-600 font-semibold">{error}</p>}

      <div className="bg-white shadow rounded p-6 mb-4">
        <div className="grid md:grid-cols-3 gap-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="input"
          >
            <option>Change of Address</option>
            <option>Change of Mobile</option>
            <option>Bank Mandate Update</option>
            <option>PAN/KYC Update</option>
            <option>Re-issue Account Statement</option>
          </select>
          <input
            placeholder="Details / Reason"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="input col-span-2"
          />
        </div>
        <div className="mt-3">
          <button
            onClick={raise}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Raise Request
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-6">
        <h3 className="font-semibold mb-3">Recent Requests</h3>
        <div className="space-y-2">
          {requests.length === 0 ? (
            <p className="text-gray-600">No requests found.</p>
          ) : (
            requests.map((r) => (
              <div
                key={r.id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <div>
                  <div className="font-semibold">{r.type}</div>
                  <div className="text-sm text-gray-500">Created: {r.created}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`text-sm font-semibold ${
                      r.status === "Resolved"
                        ? "text-green-600"
                        : r.status === "In Progress"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    {r.status}
                  </div>
                  <button
                    onClick={() => openRequest(r)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Open
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedRequest && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closePreview}
        >
          <div
            className="bg-white p-6 rounded shadow-lg max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Request Details</h3>
            <p><strong>Type:</strong> {selectedRequest.type}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>
            <p><strong>Created:</strong> {selectedRequest.created}</p>
            <p><strong>Details:</strong></p>
            <p className="whitespace-pre-wrap">{selectedRequest.details}</p>
            <button
              onClick={closePreview}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
