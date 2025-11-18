import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../services/AuthContext";
import Purchase from "./Purchase";
import SIPSetup from "./SIPSetup";
import SWPSetup from "./SWPSetup";
import STPSetup from "./STPSetup";
import SwitchSetup from "./SwitchSetup";

export default function FolioDetails() {
  const { id } = useParams();
  const { fetchWithAuth } = useAuth();

  const [folioId, setFolioId] = useState(id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("holdings");
  const [transactions, setTransactions] = useState([]);
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    async function fetchFolioData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch holdings
        const holdingsRes = await fetchWithAuth(`/investor/folios/${id}/holdings`);
        if (!holdingsRes.ok) {
          const errText = await holdingsRes.text();
          throw new Error(`Failed to fetch holdings: ${holdingsRes.status} ${errText}`);
        }
        setHoldings(await holdingsRes.json());

        // Fetch transactions (same as your transaction history)
        const txnsRes = await fetchWithAuth(`/investor/folios/${id}/transactions`);
        if (!txnsRes.ok) {
          const errText = await txnsRes.text();
          throw new Error(`Failed to fetch transactions: ${txnsRes.status} ${errText}`);
        }
        setTransactions(await txnsRes.json());

        setFolioId(id);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    }

    fetchFolioData();
  }, [id, fetchWithAuth]);

  const addTransaction = (txn) => {
    setTransactions((prev) => {
      const exists = prev.find((t) => t.txn_id === txn.txn_id);
      if (exists) return prev.map((t) => (t.txn_id === txn.txn_id ? txn : t));
      return [txn, ...prev];
    });

    if (txn.status === "Completed") {
      setHoldings((prev) => {
        const idx = prev.findIndex((h) => h.scheme === txn.scheme_id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx].units = parseFloat((updated[idx].units + txn.units).toFixed(4));
          updated[idx].value = parseFloat((updated[idx].units * txn.nav).toFixed(2));
          return updated;
        } else {
          return [
            ...prev,
            {
              scheme: txn.scheme_id,
              units: txn.units,
              nav: txn.nav,
              value: txn.amount,
            },
          ];
        }
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "holdings":
        return (
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4">Scheme Holdings</h3>
            {/* Responsive holdings table (mobile & desktop views) */}
            {/* ...your existing holdings code here... */}
          </div>
        );
      case "transactions":
        return (
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4">Transaction History</h3>
            <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
              <table className="min-w-full table-auto border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Transaction ID</th>
                    <th className="p-2 border">Folio</th>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Scheme</th>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Units</th>
                    <th className="p-2 border">NAV per Unit (₹)</th>
                    <th className="p-2 border">Amount (₹)</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.txn_id} className="hover:bg-gray-50">
                      <td className="p-2 border">{t.txn_id}</td>
                      <td className="p-2 border">{t.folio_number}</td>
                      <td className="p-2 border">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="p-2 border">{t.scheme_id}</td>
                      <td className="p-2 border">{t.txn_type}</td>
                      <td className="p-2 border">{t.units.toFixed(4)}</td>
                      <td className="p-2 border">₹{t.nav.toFixed(2)}</td>
                      <td className="p-2 border">₹{t.amount.toLocaleString()}</td>
                      <td className={`p-2 border font-semibold ${t.status === "Completed" ? "text-green-600" : "text-yellow-600"}`}>
                        {t.status}
                      </td>
                      <td className="p-2 border">{t.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "sips":
        return <SIPSetup addSIP={addTransaction} />;
      case "purchase":
        return <Purchase addTransaction={addTransaction} />;
      case "swp":
        return <SWPSetup addSWP={addTransaction} />;
      case "stp":
        return <STPSetup holdings={holdings} addTransaction={addTransaction} />;
      case "switch":
        return <SwitchSetup addTransaction={addTransaction} holdings={holdings} />;
      default:
        return null;
    }
  };

  if (loading) return <div>Loading folio details...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="p-3 md:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow rounded-lg p-3 md:p-6 mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Folio {folioId}</h2>
        <p className="text-gray-600 text-sm md:text-base">Holder: John Doe | PAN: ABCDE1234F</p>
        <p className="text-gray-600 text-sm md:text-base">Email: john@example.com | Phone: +91 9876543210</p>
      </div>
      <div className="flex gap-2 border-b mb-4 overflow-x-auto">
        {["holdings", "transactions", "sips", "purchase", "swp", "stp", "switch"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-3 py-2 text-sm md:text-base ${
              activeTab === tab ? "border-b-2 border-blue-600 text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="bg-white shadow rounded-lg p-3 md:p-6">{renderTabContent()}</div>
    </div>
  );
}
