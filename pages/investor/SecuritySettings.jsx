import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";

export default function SecuritySettings() {
  const { fetchWithAuth } = useAuth();
  const [twoFA, setTwoFA] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [showPassword, setShowPassword] = useState({ current: false, newPass: false, confirm: false });
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res2fa = await fetchWithAuth(`/auth/2fa-status`);
        if (!res2fa.ok) throw new Error("Failed to fetch 2FA status");
        const data2fa = await res2fa.json();
        setTwoFA(data2fa.enabled);

        const resSessions = await fetchWithAuth('/auth/sessions');
        if (!resSessions.ok) throw new Error("Failed to fetch sessions");
        // Backend returns list directly, not wrapped
        const dataSessions = await resSessions.json();
        setSessions(dataSessions || []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  const changePassword = async () => {
    if (!passwords.current || !passwords.newPass) {
      alert("Enter passwords");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      alert("New passwords mismatch");
      return;
    }
    setError("");
    try {
      const res = await fetchWithAuth(`/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: passwords.current,
          new_password: passwords.newPass,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        alert("Password change failed: " + (errData.detail || res.statusText));
        return;
      }
      alert("Password changed successfully.");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      alert("An error occurred: " + err.message);
    }
  };

  const toggleTwoFA = async () => {
    setError("");
    try {
      const res = await fetchWithAuth(`/auth/2fa`, {
        method: twoFA ? "DELETE" : "POST",
      });
      if (!res.ok) throw new Error("Failed to update 2FA status");
      setTwoFA(!twoFA);
    } catch (err) {
      alert("Error toggling 2FA: " + err.message);
    }
  };

  const signOutSession = async (sessionId) => {
    setError("");
    try {
      const res = await fetchWithAuth(`/auth/sessions/${sessionId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to sign out session");
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      alert("Error signing out session: " + err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Security Settings</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white shadow rounded p-6 mb-6">
        <h3 className="font-semibold mb-2">Two-Factor Authentication</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={twoFA} onChange={toggleTwoFA} />
            <span>{twoFA ? "Disable 2FA" : "Enable 2FA"}</span>
          </label>
          <div className="text-sm text-gray-500">{twoFA ? "2FA is enabled" : "2FA is disabled"}</div>
        </div>
      </div>

      <div className="bg-white shadow rounded p-6 mb-6">
        <h3 className="font-semibold mb-2">Change Password</h3>
        <div className="grid md:grid-cols-3 gap-3">

          {/* Current Password */}
          <div className="relative">
            <input
              type={showPassword.current ? "text" : "password"}
              placeholder="Current password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="input pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-2 flex items-center"
              onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
              tabIndex={-1}
              aria-label={showPassword.current ? "Hide current password" : "Show current password"}
            >
              {showPassword.current ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-6 0-9-7-9-7a18.176 18.176 0 013.838-5.707" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 2l20 20" />
                </svg>
              )}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <input
              type={showPassword.newPass ? "text" : "password"}
              placeholder="New password"
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
              className="input pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-2 flex items-center"
              onClick={() => setShowPassword({ ...showPassword, newPass: !showPassword.newPass })}
              tabIndex={-1}
              aria-label={showPassword.newPass ? "Hide new password" : "Show new password"}
            >
              {showPassword.newPass ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-6 0-9-7-9-7a18.176 18.176 0 013.838-5.707" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 2l20 20" />
                </svg>
              )}
            </button>
          </div>

          {/* Confirm New Password */}
          <div className="relative">
            <input
              type={showPassword.confirm ? "text" : "password"}
              placeholder="Confirm new password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="input pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-2 flex items-center"
              onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
              tabIndex={-1}
              aria-label={showPassword.confirm ? "Hide confirm password" : "Show confirm password"}
            >
              {showPassword.confirm ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-6 0-9-7-9-7a18.176 18.176 0 013.838-5.707" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 2l20 20" />
                </svg>
              )}
            </button>
          </div>

        </div>
        <div className="mt-3">
          <button onClick={changePassword} className="bg-blue-600 text-white px-4 py-2 rounded">
            Change Password
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-6">
        <h3 className="font-semibold mb-2">Active Sessions</h3>
        <div className="space-y-2">
          {sessions.length === 0 ? (
            <p>No active sessions found.</p>
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="flex justify-between items-center border p-3 rounded">
                <div>
                  <div className="font-semibold">{s.device}</div>
                  <div className="text-sm text-gray-500">{s.ip_address} • Last active: {new Date(s.last_active).toLocaleString()}</div>
                </div>
                <button
                  onClick={() => signOutSession(s.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Sign Out
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
