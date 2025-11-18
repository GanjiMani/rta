import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function DocumentManager() {
  const { fetchWithAuth } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setError("");
    try {
      const res = await fetchWithAuth(`/investor/documents`, {
        method: "GET",
      });
      if (!res.ok) throw new Error("Failed to fetch documents");
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadStatus("");
    setError("");
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadStatus("Please select a file to upload.");
      return;
    }
    setUploadStatus("");
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("document_type", "supporting_document");

      const res = await fetchWithAuth(`/investor/documents`, {
        method: "POST",
        body: formData,
        // Do not set 'Content-Type' header manually for FormData
      });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.detail || "Failed to upload document");
        return;
      }
      const newDoc = await res.json();
      setDocuments([newDoc, ...documents]);
      setSelectedFile(null);
      setUploadStatus("File uploaded successfully and pending verification.");
    } catch (err) {
      setError("Error uploading file: " + err.message);
    }
  };

  const handleDownload = async (documentId, filename) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/investor/documents/download/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to download file: " + res.statusText);
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert("Download error: " + err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Document Manager</h1>

        <section className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Supporting Document</h2>
          {uploadStatus && (
            <p className={`mb-3 font-semibold ${uploadStatus.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
              {uploadStatus}
            </p>
          )}
          {error && <p className="mb-3 font-semibold text-red-600">{error}</p>}

          <form onSubmit={handleFileUpload}>
            <input type="file" onChange={handleFileChange} className="mb-4" accept=".pdf,.jpg,.jpeg,.png" />
            <br />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Upload Document
            </button>
          </form>
        </section>

        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Uploaded Documents</h2>
          {documents.length === 0 ? (
            <p className="text-gray-600">No documents uploaded yet.</p>
          ) : (
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border text-left">Document Name</th>
                  <th className="p-2 border text-left">Uploaded On</th>
                  <th className="p-2 border text-left">Status</th>
                  <th className="p-2 border text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(({ id, name, uploaded_on, status }) => (
                  <tr key={id} className="hover:bg-gray-50">
                    <td className="p-2 border break-all">{name}</td>
                    <td className="p-2 border">{uploaded_on}</td>
                    <td
                      className={`p-2 border font-semibold ${
                        status === "Verified"
                          ? "text-green-600"
                          : status === "Pending"
                          ? "text-yellow-600"
                          : "text-gray-600"
                      }`}
                    >
                      {status}
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleDownload(id, name)}
                        className="text-blue-600 hover:underline"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
