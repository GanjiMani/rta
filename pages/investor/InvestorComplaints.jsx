import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function InvestorComplaints() {
  const { fetchWithAuth } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setError("");
    try {
      const res = await fetchWithAuth(`/investor/complaints`);
      if (!res.ok) throw new Error("Failed to fetch complaints");
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setFormError("Please fill in both subject and description.");
      setFormSuccess("");
      return;
    }
    setFormError("");
    try {
      const payload = {
        subject: subject.trim(),
        description: description.trim(),
        date: new Date().toISOString().slice(0, 10),
        status: "Open",
      };
      const res = await fetchWithAuth(`/investor/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to submit complaint");
      }
      const newComplaint = await res.json();
      setComplaints([newComplaint, ...complaints]);
      setSubject("");
      setDescription("");
      setFormSuccess("Complaint submitted successfully.");
    } catch (err) {
      setFormError(err.message);
    }
  };

  const openPreview = (complaint) => {
    setSelectedComplaint(complaint);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedComplaint(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Investor Complaints</h1>

        {error && <p className="mb-4 text-red-600 font-semibold">{error}</p>}

        <section className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Submit a New Complaint</h2>
          {formError && <p className="text-red-600 font-semibold mb-2">{formError}</p>}
          {formSuccess && <p className="text-green-600 font-semibold mb-2">{formSuccess}</p>}

          <form onSubmit={handleSubmit}>
            <label className="block mb-2 font-medium text-gray-700">
              Subject
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="E.g., Redemption Delay"
              />
            </label>

            <label className="block mb-4 font-medium text-gray-700">
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your issue in detail"
              />
            </label>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Submit Complaint
            </button>
          </form>
        </section>

        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Complaints History</h2>
          {complaints.length === 0 ? (
            <p className="text-gray-600">No complaints submitted yet.</p>
          ) : (
            <ul>
              {complaints.map(({ id, date, status, subject, description }) => (
                <li
                  key={id}
                  className="border-b border-gray-200 py-3 last:border-b-0 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-blue-700">{subject}</p>
                    <p
                      title="Status of your complaint"
                      className={`text-sm font-semibold px-3 py-1 rounded cursor-default select-none ${
                        status === "Resolved"
                          ? "bg-green-100 text-green-600"
                          : status === "Open"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {status}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{description}</p>
                  <p className="text-xs text-gray-400">Date: {date}</p>
                  <button
                    onClick={() => openPreview({ id, date, status, subject, description })}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Open
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Preview Modal */}
        {showPreview && selectedComplaint && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closePreview}
          >
            <div
              className="bg-white p-6 rounded shadow-lg max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">Complaint Details</h3>
              <p>
                <strong>Subject:</strong> {selectedComplaint.subject}
              </p>
              <p>
                <strong>Status:</strong> {selectedComplaint.status}
              </p>
              <p>
                <strong>Date:</strong> {selectedComplaint.date}
              </p>
              <p className="whitespace-pre-wrap mt-2">{selectedComplaint.description}</p>
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
    </div>
  );
}
