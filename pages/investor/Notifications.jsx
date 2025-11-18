import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Notifications() {
  const { fetchWithAuth } = useAuth();
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setError("");
    try {
      const res = await fetchWithAuth(`/investor/notifications`);
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const markRead = async (id) => {
    setError("");
    try {
      const res = await fetchWithAuth(`/investor/notifications/${id}/mark-read`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to mark notification as read");
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const clearAll = async () => {
    setError("");
    try {
      const res = await fetchWithAuth(`/investor/notifications/clear-all`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to clear notifications");
      setNotes([]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>

      {error && <p className="mb-4 text-red-600 font-semibold">{error}</p>}

      <div className="bg-white shadow rounded p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            You have {notes.filter((n) => !n.read).length} unread notifications
          </div>
          <div className="flex gap-3">
            <button
              onClick={clearAll}
              className="text-sm text-red-600"
              disabled={notes.length === 0}
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {notes.length === 0 && (
            <div className="text-gray-500">No notifications</div>
          )}
          {notes.map((n) => (
            <div
              key={n.id}
              className={`border p-3 rounded flex justify-between ${
                n.read ? "bg-gray-50" : "bg-white"
              }`}
            >
              <div>
                <div className="font-semibold">{n.title}</div>
                <div className="text-sm text-gray-500">{n.date}</div>
              </div>
              {!n.read && (
                <button
                  onClick={() => markRead(n.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
