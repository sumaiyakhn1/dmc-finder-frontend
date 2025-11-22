import { useState } from "react";
import "./App.css";

// Logo coming from PUBLIC folder
const logo = "/logo.webp";

function App() {
  const [roll, setRoll] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const API_URL = "https://dmc-finder-backend.onrender.com";

  const searchRoll = async () => {
    if (!roll.trim()) {
      setError("Please enter a roll number.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roll_no: roll.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Roll not found.");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Server error, try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="page">

      {/* Header */}
      <header className="header">
        <img src={logo} alt="logo" className="logo" />
        <h2>OkieDokie DMC Finder</h2>
      </header>

      {/* Search Card */}
      <div className="search-card">
        <h3>Enter Your College Roll Number</h3>

        <div className="input-row">
          <input
            type="text"
            placeholder="e.g. 1230100207"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
          />
          <button onClick={searchRoll}>Search</button>
        </div>

        {loading && <div className="spinner"></div>}

        {error && <p className="error">{error}</p>}

        {result && (
          <div className="result-box">
            <p><strong>College Roll:</strong> {result.college_roll}</p>
            <p><strong>Exam Roll:</strong> {result.exam_roll}</p>
            <p><strong>File:</strong> {result.file_name}</p>

            <div className="btn-row">
              <a className="view-btn" href={result.drive_view_url} target="_blank" rel="noopener noreferrer">
                View PDF
              </a>
              <a className="download-btn" href={result.drive_download_url} target="_blank" rel="noopener noreferrer">
                Download PDF
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
