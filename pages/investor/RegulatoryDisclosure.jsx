import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function RegulatoryDisclosures() {
  const { fetchWithAuth } = useAuth();
  const [disclosures, setDisclosures] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDisclosures();
  }, []);

  const fetchDisclosures = async () => {
    setError("");
    try {
      const res = await fetchWithAuth(`/regulatory-disclosures`);
      if (!res.ok) throw new Error("Failed to fetch disclosures");
      const data = await res.json();
      setDisclosures(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-8">Regulatory Disclosures</h1>
        {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}
        <section className="space-y-8">
          {disclosures.length === 0 ? (
            <p className="text-gray-600">No disclosures available.</p>
          ) : (
            disclosures.map(({ id, title, content }) => (
              <article key={id} className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">{title}</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{content}</p>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
