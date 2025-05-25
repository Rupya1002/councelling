"use client";
import { useEffect, useState } from "react";
import "./display.css";
import { useRouter, useSearchParams } from "next/navigation";

export function PossibleBranchesClient() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const rank = parseInt(searchParams.get("rank")) || 0;

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const data = localStorage.getItem("possibleBranches");
        if (data) {
          const parsed = JSON.parse(data);
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

  const probability = (branch) =>{
    const openingRank = parseInt(branch.OpeningRank);
    const closingRank = parseInt(branch.ClosingRank);
    if (isNaN(openingRank) || isNaN(closingRank)) {
      return 0;
    }
    if (rank < (( closingRank *4  + openingRank)/5)) {
      return 100;
    }
    if (rank > closingRank*1.4) {
      return 0;
    }
    return ((closingRank*1.4 - rank) / (closingRank*1.4 - (( closingRank *4  + openingRank)/5))) * 100;
  }

  // Custom sort: >60% probability first (sorted by closing rank), then the rest (also by closing rank)
  const filteredBranches = branches
    .map((branch) => ({ ...branch, prob: probability(branch) }))
    .filter((branch) => branch.prob > 0)
    .sort((a, b) => {
      const aHigh = a.prob > 60;
      const bHigh = b.prob > 60;
      if (aHigh && !bHigh) return -1;
      if (!aHigh && bHigh) return 1;
      // Both in same group, sort by closing rank ascending
      return a.ClosingRank - b.ClosingRank;
    });

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
      ) : filteredBranches.length === 0 ? (
        <div className="no-results-category">
          <p>No branches found matching your criteria.</p>
        </div>
      ) : (
        <div className="institutes-grid">
          {filteredBranches.map((branch, idx) => (
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
                    <span className="rank-value">
                      {Math.round(parseInt(branch.OpeningRank))}
                    </span>
                  </div>
                  <div className="rank-item">
                    <span className="rank-label">Closing Rank</span>
                    <span className="rank-value">
                      {Math.round(parseInt(branch.ClosingRank))}
                    </span>
                  </div>
                </div>
                <div className="probability-bar-container">
                  <div className="probability-bar-bg">
                    <div
                      className={`probability-bar-fill ${
                        branch.prob > 80
                          ? "highly-probable"
                          : branch.prob > 50
                          ? "probable"
                          : "less-probable"
                      }`}
                      style={{ width: `${branch.prob}%` }}
                    ></div>
                  </div>
                  <span className="probability-label">
                    {branch.prob > 80
                      ? "Highly Probable"
                      : branch.prob > 50
                      ? "Probable"
                      : "Less Probable"}
                  </span>
                </div>
                <div className="click-hint">
                  Click to view round-wise details →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 