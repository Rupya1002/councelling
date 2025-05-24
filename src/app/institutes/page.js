"use client";
import { useState, useEffect } from 'react';
import './institute.css';

export default function InstitutesPage() {
    const [loading, setLoading] = useState(true);
    const [institutes, setInstitutes] = useState({
        iit: [],
        nit: []
    });
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState('');

    useEffect(() => {
        const handleResize = () => {
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        };

        if (typeof window !== 'undefined') {
            try {
                const savedData = localStorage.getItem('data');

                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    
                    setFormData(parsedData);
                    setInstitutes({
                        iit: parsedData.adv || [],
                        nit: parsedData.main || []
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
           
            {getCount(institutes.iit) > 0 || getCount(institutes.nit) > 0 ? (
                <div className="institutes-list">
                    {getCount(institutes.iit) > 0 && (
                        <div>
                            <h2>Recommended IIT ({getCount(institutes.iit)})</h2>
                            <ul>
                                {institutes.iit.map((institute, index) => (
                                    <li key={`iit-${index}`} className="institute-item">
                                        <h3>{institute.institute}</h3>
                                        <p>Branch: {institute.Academicprogramname}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {getCount(institutes.nit) > 0 && (
                        <div>
                            <h2>Recommended NIT ({getCount(institutes.nit)})</h2>
                            <ul>
                                {institutes.nit.map((institute, index) => (
                                    <li key={`nit-${index}`} className="institute-item">
                                        <h3>{institute.institute}</h3>
                                        <p>Branch: {institute.Academicprogramname}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <div className="no-results">
                    <p>No college recommendations found for your criteria.</p>
                    <button onClick={goBack} className="retry-button">
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}