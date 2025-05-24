"use client";
import { useState, useEffect } from 'react';
import './institute.css';

export default function InstitutesPage() {
    const [loading, setLoading] = useState(true);
    const [institutes, setInstitutes] = useState({
        "iit": [],
        "nit": []
    });
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        };

        if (typeof window !== 'undefined') {
            try {
                const savedData = localStorage.getItem('data');
                const formData = localStorage.getItem('jeeFormData');
                
                if (savedData && formData) {
                    const parsedData = JSON.parse(savedData);
                    const parsedFormData = JSON.parse(formData);
                    
                    setFormData(parsedFormData);
                    setInstitutes({
                        "iit": parsedData.adv || [],
                        "nit": parsedData.mains || []
                    });
                } else {
                    setError('No saved data found. Please fill the counselling form first.');
                }
            } catch (err) {
                console.error('Error loading data:', err);
                setError('Failed to load data.');
            } finally {
                setLoading(false);
            }

            window.addEventListener('resize', handleResize);
            handleResize();
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

      const goBack = () => {
        window.location.href = '/';
    };

    if (loading) {
        return (
            <div className="institutes-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your college recommendations...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="institutes-container">
                <p className="error-message">{error}</p>
                <button onClick={goBack} className="retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    // Helper function to get the number of objects in an array
    const getCount = arr => Array.isArray(arr) ? arr.length : 0;


    return (
        <div className="institutes-container">
            <button onClick={goBack} className="back-button">
                ← Back to Form
            </button>

            {formData && (
                <div className="search-params">
                    <p>JEE Advanced Rank: {parseInt(formData.jeeAdvancedCategoryRank || formData.jeeAdvancedRank, 10)}</p>
                    <p>JEE Mains Rank: {parseInt(formData.jeeMainsCategoryRank || formData.jeeMainsRank, 10)}</p>
                    <p>Category: {formData.category}</p>
                </div>
            )}
           
            {getCount(institutes['iit']) > 0 || getCount(institutes["nit"]) > 0 ? (
                <div className="institutes-list">
                    {getCount(institutes['iit']) > 0 && (
                        <div className="institute-section">
                            <h2 className="institutes-title">Recommended IITs ({getCount(institutes['iit'])})</h2>
                            <div className="institutes-grid">
                                {institutes['iit'].map((institute, index) => (
                                    <div key={`iit-${index}`} className="institute-card">
                                        <h3 className="institute-name">{institute.Institute}</h3>
                                        <div className="institute-details">
                                            <span>Branch: <span>{institute.AcademicProgramName}</span></span><br />
                                            <span>Opening Rank: <span>{parseInt(institute.OpeningRank, 10)}</span></span><br />
                                            <span>Closing Rank: <span>{parseInt(institute.ClosingRank, 10)}</span></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {getCount(institutes['nit']) > 0 && (
                        <div className="institute-section">
                            <h2 className="institutes-title">Recommended NITs ({getCount(institutes['nit'])})</h2>
                            <div className="institutes-grid">
                                {institutes['nit'].map((institute, index) => (
                                    <div key={`nit-${index}`} className="institute-card">
                                        <h3 className="institute-name">{institute.Institute}</h3>
                                        <div className="institute-details">
                                            <span>Branch: <span>{institute.AcademicProgramName}</span></span><br />
                                            <span>Opening Rank: <span>{parseInt(institute.OpeningRank, 10)}</span></span><br />
                                            <span>Closing Rank: <span>{parseInt(institute.ClosingRank, 10)}</span></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="no-results">
                    <p>No college recommendations found for your criteria</p>
                    <button onClick={goBack} className="retry-button">
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}