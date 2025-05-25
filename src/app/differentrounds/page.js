"use client";
import { useState, useEffect } from 'react';
import './rounds.css';

export default function RoundsPage() {
    const [loading, setLoading] = useState(true);
    const [instituteData, setInstituteData] = useState(null);
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadInstituteData = () => {
            try {
                const selectedInstitute = localStorage.getItem('selectedInstitute');
                const formDataStr = localStorage.getItem('jeeFormData');
                // console.log('Selected Institute:', selectedInstitute);
                console.log('Form Data:', formDataStr);
                if (!selectedInstitute) {
                    setError('No institute selected');
                    return;
                }

                const data = JSON.parse(selectedInstitute);
                setInstituteData(data);

                if (formDataStr) {
                    const parsedFormData = JSON.parse(formDataStr);
                    setFormData(parsedFormData);
                }
            } catch (err) {
                console.error('Error loading data:', err);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        loadInstituteData();
    }, []);

    const goBack = () => {
        window.history.back();
    };

    if (loading) {
        return (
            <div className="rounds-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading round details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounds-container">
                <p className="error-message">{error}</p>
                <button onClick={goBack} className="back-button">
                    Go Back
                </button>
            </div>
        );
    }

    const rounds = [1, 2, 3, 4, 5, 6];

    return (
        <div className="rounds-container">
            <button onClick={goBack} className="back-button">
                ← Back to Institutes
            </button>

            <div className="institute-header">
                <h1 className="institute-name">{instituteData?.Institute}</h1>
                <h2 className="branch-name">{instituteData?.AcademicProgramName}</h2>
                {formData?.category && (
                    <h3 className="category-name">Category: {(formData.category).toUpperCase()}</h3>
                )}
            </div>

            <div className="rounds-grid">
                {rounds.map(round => {
                    const openingRank = instituteData?.[`Round${round}OpeningRank`];
                    const closingRank = instituteData?.[`Round${round}ClosingRank`];

                    if (!openingRank || !closingRank) return null;

                    return (
                        <div key={round} className="round-card">
                            <h3 className="round-title">Round {round}</h3>
                            <div className="rank-details">
                                <div className="rank-item">
                                    <span className="rank-label">Opening Rank</span>
                                    <span className="rank-value">{parseInt(openingRank, 10)}</span>
                                </div>
                                <div className="rank-item">
                                    <span className="rank-label">Closing Rank</span>
                                    <span className="rank-value">{parseInt(closingRank, 10)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}