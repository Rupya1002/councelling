"use client";
import { useState, useEffect } from 'react';
import './institute.css';

export default function InstitutesPage() {
    const [loading, setLoading] = useState(true);
    const [institutes, setInstitutes] = useState({
        "iit": [],
        "nit": [],
        "iiit": [],
        "gfti": []
    });
    const [formData, setFormData] = useState(null);
    const [error, setError] = useState(null);
    const [selectedInstitute, setSelectedInstitute] = useState('all');
   
    const handleMoreInfo = (institute) => {
        localStorage.setItem('selectedInstitute', JSON.stringify(institute));
        window.location.href = '/differentrounds';
    };

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
                    
                    console.log('Parsed Data:', parsedData);
                    
                    setFormData(parsedFormData);
                    setInstitutes({
                        "iit": Array.isArray(parsedData.adv) ? parsedData.adv : [],
                        "nit": Array.isArray(parsedData.mains) ? 
                            parsedData.mains.filter(inst => inst.Type === 'NIT') : [],
                        "iiit": Array.isArray(parsedData.mains) ? 
                            parsedData.mains.filter(inst => inst.Type === 'IIIT') : [],
                        "gfti": Array.isArray(parsedData.mains) ? 
                            parsedData.mains.filter(inst => !['NIT', 'IIIT', 'IIT'].includes(inst.Type)) : []
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

    const handleInstituteChange = (event) => {
        setSelectedInstitute(event.target.value);
    };

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

    const getCount = arr => Array.isArray(arr) ? arr.length : 0;
    const hasInstitutes = Object.values(institutes).some(arr => getCount(arr) > 0);

    const titles = {
        iit: 'Recommended IITs',
        nit: 'Recommended NITs',
        iiit: 'Recommended IIITs',
        gfti: 'Recommended GFTIs'
    };

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

            <div className="institute-filter">
                <select 
                    value={selectedInstitute} 
                    onChange={handleInstituteChange}
                    className="institute-select"
                >
                    <option value="all">All Institutions</option>
                    <option value="iit">IITs Only</option>
                    <option value="nit">NITs Only</option>
                    <option value="iiit">IIITs Only</option>
                    <option value="gfti">GFTIs Only</option>
                </select>
            </div>
           
            <div className="institutes-list">
                {['iit', 'nit', 'iiit', 'gfti'].map(type => {
                    if (selectedInstitute === 'all' || selectedInstitute === type) {
                        return (
                            <div key={type} className="institute-section">
                                <h2 className="institutes-title">{titles[type]}</h2>
                                {getCount(institutes[type]) > 0 ? (
                                    <div className="institutes-grid">
                                        {institutes[type].map((institute, index) => (
                                            <div key={`${type}-${index}`} className="institute-card">
                                                <h3 className="institute-name">{institute.Institute}</h3>
                                                <div className="institute-details">
                                                    <span>Branch: <span>{institute.AcademicProgramName}</span></span><br />
                                                    <span>Opening Rank: <span>{parseInt(institute.OpeningRank, 10)}</span></span><br />
                                                    <span>Closing Rank: <span>{parseInt(institute.ClosingRank, 10)}</span></span>
                                                    <button onClick={() => handleMoreInfo(institute)} className="more-info-button">View Rounds</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-results-category">
                                        <p>No {titles[type].split(' ')[1]} found matching your criteria</p>
                                    </div>
                                )}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
}