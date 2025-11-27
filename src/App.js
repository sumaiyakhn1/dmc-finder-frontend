import { useState, useEffect } from "react";
import "./App.css";

const logo = "/logo.webp";

function App() {
  const [roll, setRoll] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [visits, setVisits] = useState(3000); // default until fetch loads

  const API_URL = "https://dmc-finder-backend.onrender.com";

  // Load visitor count
  useEffect(() => {
    fetch(`${API_URL}/visits`)
      .then((res) => res.json())
      .then((data) => setVisits(data.visits))
      .catch(() => {});
  }, []);

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
        setVisits((v) => v + 1); // update UI instantly
      }
    } catch (err) {
      setError("Server error, try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="page">

      {/* ⭐ Visitor Badge (Top Right) */}
      <div className="visitor-badge">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="eye-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>

        <span id="visitorCount">{visits}</span>

        <div className="tooltip">Total Visitors</div>
      </div>

      {/* Header */}
      <header className="header header-row">
        <div className="header-left">
          <img src={logo} alt="logo" className="logo-big" />
          <div className="header-text">
            <h1 className="brand">OkieDokie</h1>
            <p className="sub">Admit Card Finder</p>
          </div>
        </div>
      </header>

      {/* Search Card */}
      <div className="search-card fade-in">
        <h3 className="card-title">Enter Your College Roll Number</h3>

        <div className="input-row">
          <input
            type="text"
            placeholder="e.g. 1230100207"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchRoll()}
          />
          <button onClick={searchRoll} className="search-btn">
            Search
          </button>
        </div>

        {loading && <div className="spinner"></div>}
        {error && <p className="error">{error}</p>}

        {result && (
          <div className="result-box slide-up">
            <p><strong>College Roll:</strong> {result.college_roll}</p>
            <p><strong>Exam Roll:</strong> {result.exam_roll}</p>
            <p><strong>File:</strong> {result.file_name}</p>

            <div className="btn-row">
              <a
                className="view-btn"
                href={result.drive_view_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View PDF
              </a>
              <a
                className="download-btn"
                href={result.drive_download_url}
                target="_blank"
                rel="noopener noreferrer"
              >
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
