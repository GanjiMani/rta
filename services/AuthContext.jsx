import React, { createContext, useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem("token");
    console.log("fetchWithAuth token:", token);

    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };
    const opts = { ...options, headers };

    // Prepend API_URL to the URL to call backend correctly
    const res = await fetch(API_URL + url, opts);

    if (res.status === 401) {
      logout();
      throw new Error("Unauthorized");
    }
    return res;
  }

    async function register(payload, isAdmin = false) {
  setLoading(true);
  try {
    // Pick the correct endpoint
    const endpoint = isAdmin ? "/admin/register" : "/auth/register";
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (Array.isArray(errorData.detail)) {
        const messages = errorData.detail
          .map((err) => `${err.loc.join(".")}: ${err.msg}`)
          .join(", ");
        throw new Error(messages);
      } else {
        throw new Error(errorData.detail || "Registration failed");
      }
    }

    setLoading(false);
  } catch (error) {
    setLoading(false);
    console.error("Register error", error);
    throw error;
  }
}
async function login(email, password, isAdmin = false) {
    setLoading(true);
    setError(null);

    const payload = { email, password };
    const loginEndpoint = isAdmin ? "/admin/login" : "/auth/login";
    const profileEndpoint = isAdmin ? "/admin/admindashboard" : "/investor/profile";

    try {
      const response = await fetch(`${API_URL}${loginEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);

      if (!data.access_token || data.access_token.length < 10) {
        throw new Error("Invalid token received");
      }
      console.log("Sending token:", data.access_token);
      const profileResponse = await fetch(`${API_URL}${profileEndpoint}`, {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });

      if (!profileResponse.ok) {
        const resText = await profileResponse.text();
        throw new Error(`Failed to fetch profile: ${resText}`);
      }

      const profileData = await profileResponse.json();
      if (!profileData.role) {
        profileData.role = "user"; // fallback role
      }

      localStorage.setItem("user", JSON.stringify(profileData));
      setUser(profileData);
      navigate(isAdmin ? "/admin/admindashboard" : "/investor");
      setLoading(false);
      return profileData;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  }



  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/");
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      fetchWithAuth,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
