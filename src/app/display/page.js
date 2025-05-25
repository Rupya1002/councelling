"use client";
import { useEffect, useState } from "react";
import "./display.css";
import { useRouter } from "next/navigation";

export default function PossibleBranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const data = localStorage.getItem("possibleBranches");
        if (data) {
          const parsed = JSON.parse(data);
          // If single object, wrap in array for uniformity
          setBranches(Array.isArray(parsed) ? parsed : [parsed]);
        } else {
          setError("No possible branches found. Please fill the form first.");
        }
      } catch (err) {
        setError("Failed to load possible branches.");
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const goBack = () => {
    router.push("/possiblebranform");
  };

  const handleBranchClick = (branch) => {
    localStorage.setItem("selectedInstitute", JSON.stringify(branch));
    router.push("/differentrounds");
  };

  // Find the institute name from the first branch, if available
  const instituteName = branches.length > 0 ? branches[0].Institute : "";

  return (
    <div className="institutes-container">
      <button onClick={goBack} className="back-button-institutes">
        ← Back to Branch Form
      </button>
      <h2 className="institutes-title">{instituteName}</h2>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading possible branches...</p>
        </div>
      ) : error ? (
        <div className="no-results-category">
          <p>{error}</p>
          <button onClick={goBack} className="retry-button">
            Try Again
          </button>
        </div>
      ) : branches.length === 0 ? (
        <div className="no-results-category">
          <p>No branches found matching your criteria.</p>
        </div>
      ) : (
        <div className="institutes-grid">
          {branches.map((branch, idx) => (
            <div 
              className="institute-card" 
              key={idx}
              onClick={() => handleBranchClick(branch)}
            >
              <div className="institute-details">
                <h3 className="institute-name">{branch.AcademicProgramName}</h3>
                <div className="rank-info">
                  <div className="rank-item">
                    <span className="rank-label">Opening Rank</span>
                    <span className="rank-value">{branch.OpeningRank}</span>
                  </div>
                  <div className="rank-item">
                    <span className="rank-label">Closing Rank</span>
                    <span className="rank-value">{branch.ClosingRank}</span>
                  </div>
                </div>
                <div className="click-hint">Click to view round-wise details →</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}