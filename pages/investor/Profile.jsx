import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const nomineeRelations = ["Father", "Mother", "Spouse", "Son", "Daughter", "Other"];

export default function Profile() {
  const { fetchWithAuth } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [personalEdit, setPersonalEdit] = useState(false);
  const [contactEdit, setContactEdit] = useState(false);
  const [bankEditIndex, setBankEditIndex] = useState(-1);
  const [nomineeEditIndex, setNomineeEditIndex] = useState(-1);

  const [error, setError] = useState("");
  const [docError, setDocError] = useState("");

  const [user, setUser] = useState({
    hasProfile: false,
    name: "",
    email: "",
    phone: "",
    address: "",
    pan: "",
    dob: "",
    kyc: "Pending",
    banks: [],
    nominees: [],
    kycDocuments: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetchWithAuth(`/investor/profile`);
        if (!res.ok) throw new Error("Unable to fetch profile");
        const data = await res.json();
        setUser({
          hasProfile: true,
          name: data.name || "",
          pan: data.pan || "",
          dob: data.dob || "",
          email: data.email || "",
          phone: data.mobile || "",
          address: data.address || "",
          kyc: data.kyc_status || "Pending",
          banks: data.banks || [],
          nominees: data.nominees || [],
          kycDocuments: [],
        });
      } catch (err) {
        setError("Failed to load profile: " + err.message);
      }
    };
    fetchProfile();
  }, [fetchWithAuth]);

  const handleField = (e, section = null, index = null) => {
    const { name, value } = e.target;
    if (section === "banks") {
      const newBanks = [...user.banks];
      newBanks[index] = { ...newBanks[index], [name]: value };
      setUser((prev) => ({ ...prev, banks: newBanks }));
    } else if (section === "nominees") {
      const newNominees = [...user.nominees];
      newNominees[index] = { ...newNominees[index], [name]: value };
      setUser((prev) => ({ ...prev, nominees: newNominees }));
    } else {
      setUser((prev) => ({ ...prev, [name]: value }));
    }
  };

const savePersonal = async () => {
  try {
    const payload = {
      name: user.name,
      pan: user.pan,
      dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : null, // 'YYYY-MM-DD'
      kyc_status: user.kyc,
      address: user.address || null,
      email: user.email || null,
      mobile: user.phone || null,
    };
    await fetchWithAuth(`/investor/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setPersonalEdit(false);
  } catch {
    setError("Failed updating personal info");
  }
};



const saveContact = async () => {
  try {
    const payload = {};
    if (user.email) payload.email = user.email;
    if (user.address) payload.address = user.address;
    if (user.phone) payload.mobile = user.phone;

    await fetchWithAuth(`/investor/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setContactEdit(false);
  } catch {
    setError("Failed updating contact info");
  }
};

  const saveBank = async (index) => {
    const bank = user.banks[index];
    const isNew = !bank.bank_id;
    const url = isNew
      ? `/investor/banks`
      : `/investor/banks/${bank.bank_id}`;
    const method = isNew ? "POST" : "PUT";
    try {
      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_no: bank.account_no,
          ifsc: bank.ifsc,
          branch: bank.branch,
        }),
      });
      if (!res.ok) throw new Error();
      const savedBank = await res.json();
      const newBanks = [...user.banks];
      newBanks[index] = savedBank;
      setUser((prev) => ({ ...prev, banks: newBanks }));
      setBankEditIndex(-1);
    } catch {
      setError("Failed saving bank info");
    }
  };

  const saveNominee = async (index) => {
    const nominee = user.nominees[index];
    const isNew = !nominee.nominee_id;
    const url = isNew
      ? `/investor/nominees`
      : `/investor/nominees/${nominee.nominee_id}`;
    const method = isNew ? "POST" : "PUT";
    try {
      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nominee.name,
          relation: nominee.relation,
          pct: nominee.pct || 100,
        }),
      });
      if (!res.ok) throw new Error();
      const savedNominee = await res.json();
      const newNominees = [...user.nominees];
      newNominees[index] = savedNominee;
      setUser((prev) => ({ ...prev, nominees: newNominees }));
      setNomineeEditIndex(-1);
    } catch {
      setError("Failed saving nominee");
    }
  };

  const deleteNominee = async (index) => {
    const nominee = user.nominees[index];
    if (!nominee.nominee_id) {
      // Remove locally if not saved yet
      setUser((prev) => ({
        ...prev,
        nominees: prev.nominees.filter((_, i) => i !== index),
      }));
      return;
    }
    try {
      const res = await fetchWithAuth(
        `/investor/nominees/${nominee.nominee_id}`,
        { method: "DELETE" }
      );
      if (res.status !== 204) throw new Error("Failed to delete nominee");
      setUser((prev) => ({
        ...prev,
        nominees: prev.nominees.filter((_, i) => i !== index),
      }));
      if (nomineeEditIndex === index) setNomineeEditIndex(-1);
    } catch (err) {
      setError(err.message);
    }
  };
  const deleteBank = async (index) => {
  const bank = user.banks[index];
  if (!bank.bank_id) {
    // Just remove locally if not saved yet
    setUser((prev) => ({
      ...prev,
      banks: prev.banks.filter((_, i) => i !== index),
    }));
    return;
  }
  try {
    const res = await fetchWithAuth(`/investor/banks/${bank.bank_id}`, {
      method: "DELETE",
    });
    if (res.status !== 204) throw new Error("Failed to delete bank");
    setUser((prev) => ({
      ...prev,
      banks: prev.banks.filter((_, i) => i !== index),
    }));
    if (bankEditIndex === index) setBankEditIndex(-1);
  } catch (error) {
    setError(error.message);
  }
};


  const addBank = () => {
    setUser((prev) => ({
      ...prev,
      banks: [...prev.banks, { account_no: "", ifsc: "", branch: "", verified: false }],
    }));
    setBankEditIndex(user.banks.length);
  };

  const addNominee = () => {
    setUser((prev) => ({
      ...prev,
      nominees: [...prev.nominees, { name: "", relation: "", pct: 100 }],
    }));
    setNomineeEditIndex(user.nominees.length);
  };

const renderPersonalTab = () => {
  if (personalEdit) {
    return (
      <div>
        <input
          name="name"
          value={user.name}
          onChange={handleField}
          placeholder="Full Name"
          className="input mb-2"
        />
        <input
          name="pan"
          value={user.pan}
          onChange={handleField}
          placeholder="PAN"
          className="input mb-2"
        />
        <input
          type="date"
          name="dob"
          value={user.dob}
          onChange={handleField}
          className="input mb-2"
        />
        <select
          name="kyc"
          value={user.kyc}
          onChange={handleField}
          className="input mb-2"
        >
          <option>Pending</option>
          <option>Verified</option>
        </select>
        <button onClick={savePersonal} className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
        <button
          onClick={() => setPersonalEdit(false)}
          className="ml-2 bg-gray-300 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    );
  }
  return (
    <div>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>PAN:</strong> {user.pan}</p>
      <p><strong>DOB:</strong> {user.dob}</p>
      <p><strong>KYC Status:</strong> {user.kyc}</p>
      <button onClick={() => setPersonalEdit(true)} className="bg-yellow-500 px-4 py-2 rounded">
        Edit
      </button>
    </div>
  );
};

  const renderContactTab = () =>
    contactEdit ? (
      <div>
        <input
          name="email"
          value={user.email}
          onChange={handleField}
          placeholder="Email"
          className="input mb-2"
        />
        <input
          name="phone"
          value={user.phone}
          onChange={handleField}
          placeholder="Phone"
          className="input mb-2"
        />
        <input
          name="address"
          value={user.address}
          onChange={handleField}
          placeholder="Address"
          className="input mb-2"
        />
        <button onClick={saveContact} className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
        <button
          onClick={() => setContactEdit(false)}
          className="ml-2 bg-gray-300 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    ) : (
      <div>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <button onClick={() => setContactEdit(true)} className="bg-yellow-500 px-4 py-2 rounded">
          Edit
        </button>
      </div>
    );

  const renderBankTab = () => (
    <div>
      {user.banks.map((bank, idx) =>
        bankEditIndex === idx ? (
          <div key={idx} className="border rounded p-3 mb-3 bg-gray-50">
            <input
              name="account_no"
              value={bank.account_no}
              onChange={(e) => handleField(e, "banks", idx)}
              placeholder="Account Number"
              className="input mb-2"
            />
            <input
              name="ifsc"
              value={bank.ifsc}
              onChange={(e) => handleField(e, "banks", idx)}
              placeholder="IFSC"
              className="input mb-2"
            />
            <input
              name="branch"
              value={bank.branch}
              onChange={(e) => handleField(e, "banks", idx)}
              placeholder="Branch"
              className="input mb-2"
            />
            <button onClick={() => saveBank(idx)} className="bg-blue-600 px-4 py-2 text-white rounded mr-2">
              Save
            </button>
            <button onClick={() => setBankEditIndex(-1)} className="bg-gray-300 px-4 py-2 rounded">
              Cancel
            </button>
            <button onClick={() => deleteBank(idx)} className="ml-2 bg-red-600 text-white px-3 py-1 rounded">
              Delete
            </button>
          </div>
        ) : (
          <div key={idx} className="border rounded p-3 mb-3 bg-gray-50">
            <p><strong>Account:</strong> {bank.account_no}</p>
            <p><strong>IFSC:</strong> {bank.ifsc}</p>
            <p><strong>Branch:</strong> {bank.branch}</p>
            <button onClick={() => setBankEditIndex(idx)} className="bg-yellow-500 px-4 py-2 rounded">
              Edit
            </button>
          </div>
        )
      )}
      <button onClick={addBank} className="bg-green-600 px-4 py-2 rounded text-white">
        Add Bank Account
      </button>
    </div>
  );

  const renderNomineeTab = () => (
    <div>
      {user.nominees.map((nominee, idx) =>
        nomineeEditIndex === idx ? (
          <div key={idx} className="border rounded p-3 mb-3 bg-gray-50">
            <input
              name="name"
              value={nominee.name}
              onChange={(e) => handleField(e, "nominees", idx)}
              placeholder="Nominee Name"
              className="input mb-2"
            />
            <select
              name="relation"
              value={nominee.relation}
              onChange={(e) => handleField(e, "nominees", idx)}
              className="input mb-2"
            >
              <option value="">-- Select Relation --</option>
              {nomineeRelations.map((rel) => (
                <option key={rel} value={rel}>{rel}</option>
              ))}
            </select>
            <input
              name="pct"
              value={nominee.pct || 100}
              type="number"
              min={1}
              max={100}
              onChange={(e) => handleField(e, "nominees", idx)}
              className="input mb-2"
              placeholder="Allocation (%)"
            />
            <button onClick={() => saveNominee(idx)} className="bg-blue-600 px-4 py-2 rounded text-white mr-2">
              Save
            </button>
            <button
              onClick={() => setNomineeEditIndex(-1)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteNominee(idx)}
              className="bg-red-600 px-4 py-2 rounded text-white ml-2"
            >
              Delete
            </button>
          </div>
        ) : (
          <div key={idx} className="border rounded p-3 mb-3 bg-gray-50">
            <p><strong>Name:</strong> {nominee.name}</p>
            <p><strong>Relation:</strong> {nominee.relation}</p>
            <p><strong>Allocation:</strong> {nominee.pct}%</p>
            <button onClick={() => setNomineeEditIndex(idx)} className="bg-yellow-500 px-4 py-2 rounded">
              Edit
            </button>
          </div>
        )
      )}
      <button onClick={addNominee} className="bg-green-600 px-4 py-2 rounded text-white">
        Add Nominee
      </button>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return renderPersonalTab();
      case "contact":
        return renderContactTab();
      case "bank":
        return renderBankTab();
      case "nominee":
        return renderNomineeTab();
      default:
        return null;
    }
  };

  if (!user.hasProfile)
    return <div className="p-6">Loading profile...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Investor Profile</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="flex gap-4 border-b mb-4">
        {["personal", "contact", "bank", "nominee"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => {
              setActiveTab(tab);
              setPersonalEdit(false);
              setContactEdit(false);
              setBankEditIndex(-1);
              setNomineeEditIndex(-1);
              setError("");
              setDocError("");
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
