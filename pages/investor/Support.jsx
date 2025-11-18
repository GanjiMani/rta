import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Support() {
  const { fetchWithAuth } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setError("");
    try {
      const res = await fetchWithAuth(`/investor/support-tickets`);
      if (!res.ok) throw new Error("Failed to fetch tickets");
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const raise = async () => {
    if (!subject.trim() || !message.trim()) {
      setFormError("Enter subject and message");
      setFormSuccess("");
      return;
    }
    setFormError("");
    try {
      const payload = {
        subject: subject.trim(),
        message: message.trim(),
        status: "Open",
        created: new Date().toISOString().slice(0, 10),
      };
      const res = await fetchWithAuth(`/investor/support-tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to submit ticket");
      }
      const newTicket = await res.json();
      setTickets([newTicket, ...tickets]);
      setSubject("");
      setMessage("");
      setFormSuccess("Ticket submitted successfully.");
    } catch (err) {
      setFormError(err.message);
    }
  };

  const openPreview = (ticket) => {
    setSelectedTicket(ticket);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedTicket(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Support & Help</h2>

      {error && <p className="mb-4 text-red-600 font-semibold">{error}</p>}

      <div className="bg-white shadow rounded p-6 mb-4">
        <h3 className="font-semibold mb-2">Raise a Ticket</h3>
        {formError && <p className="text-red-600 mb-2">{formError}</p>}
        {formSuccess && <p className="text-green-600 mb-2">{formSuccess}</p>}
        <input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input mb-2"
        />
        <textarea
          placeholder="Describe your issue"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input mb-2 h-28"
        />
        <div>
          <button onClick={raise} className="bg-blue-600 text-white px-4 py-2 rounded">
            Submit
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-6">
        <h3 className="font-semibold mb-3">Open Tickets</h3>
        <div className="space-y-2">
          {tickets.length === 0 ? (
            <p className="text-gray-600">No open tickets.</p>
          ) : (
            tickets.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <div>
                  <div className="font-semibold">{t.subject}</div>
                  <div className="text-sm text-gray-500">Created: {t.created}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`text-sm font-semibold ${
                      t.status === "Open" ? "text-yellow-600" : "text-green-600"
                    }`}
                  >
                    {t.status}
                  </div>
                  <button
                    onClick={() => openPreview(t)}
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
      {showPreview && selectedTicket && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closePreview}
        >
          <div
            className="bg-white p-6 rounded shadow-lg max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Support Ticket Details</h3>
            <p>
              <strong>Subject:</strong> {selectedTicket.subject}
            </p>
            <p>
              <strong>Status:</strong> {selectedTicket.status}
            </p>
            <p>
              <strong>Created:</strong> {selectedTicket.created}
            </p>
            <p className="whitespace-pre-wrap mt-2">{selectedTicket.message}</p>
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
