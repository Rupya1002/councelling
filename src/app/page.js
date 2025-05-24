"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function Page() {
    // This reservation object is kept for internal use but won't be displayed to users
    const reservations = {
        'O': 'OPEN',
        'E': 'EWS', 
        'ON': 'OBC-NCL',
        'SC': 'SC', 
        'ST': 'ST', 
        'OP': 'OPEN (PwD)',
        'ONP': 'OBC-NCL (PwD)',
        'EP': 'EWS (PwD)', 
        'SCP': 'SC (PwD)',
        'STP': 'ST (PwD)'
    };

    // Default form state
    const defaultFormState = {
        jeeAdvancedQualified: '',
        jeeMainsRank: '',
        jeeMainsCategoryRank: '',
        jeeAdvancedRank: '',
        jeeAdvancedCategoryRank: '',
        gender: '',
        category: '',
        isPwd: false,
    };    const [formData, setFormData] = useState(defaultFormState);
    const [isLoading, setIsLoading] = useState(false);
    const [viewportWidth, setViewportWidth] = useState(null);
    const [isSaved, setIsSaved] = useState(false); 
    const  router = useRouter();   // Load saved form data from localStorage when component mounts
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedData = localStorage.getItem('jeeFormData');
                if (savedData) {
                    setFormData(JSON.parse(savedData));
                    setIsSaved(true);
                }
            } catch (error) {
                console.error('Error loading saved form data:', error);
            }
        }
    }, []);

    // Track viewport width for responsive adjustments
    useEffect(() => {
        const updateWidth = () => setViewportWidth(window.innerWidth);
        // Set initial width
        updateWidth();
        // Add event listener
        window.addEventListener('resize', updateWidth);
        // Clean up
        return () => window.removeEventListener('resize', updateWidth);
    }, []);   
       const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newFormData = {
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        };
        
        setFormData(newFormData);
        
        // First set isSaved to false to show that changes are in progress
        setIsSaved(false);
        
        // Use debounce to avoid saving too frequently
        // Clear any existing timeout
        if (window.saveTimeout) {
            clearTimeout(window.saveTimeout);
        }
        
        // Set new timeout
        window.saveTimeout = setTimeout(() => {
            // Save to localStorage after a short delay
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('jeeFormData', JSON.stringify(newFormData));
                    setIsSaved(true);
                } catch (error) {
                    console.error('Error saving form data:', error);
                }
            }
        }, 500); // 500ms delay for debouncing
    };
    
    // Function to clear all saved data
    const isNonGeneralCategory = () => {
        return formData.category && formData.category !== 'general';
    };

    // This function is kept for internal form submission but not shown to users
    const getCategoryCode = () => {
        const baseCategory = {
            'general': 'O',
            'obc': 'ON',
            'sc': 'SC',
            'st': 'ST',
            'ews': 'E'
        }[formData.category] || '';

        if (formData.isPwd && baseCategory) {
            if (baseCategory === 'O') return 'OP';
            if (baseCategory === 'ON') return 'ONP';
            if (baseCategory === 'SC') return 'SCP';
            if (baseCategory === 'ST') return 'STP';
            if (baseCategory === 'E') return 'EP';
        }
    
        return baseCategory;
    };

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            // Smooth scroll to section
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const categoryCode = getCategoryCode();
        
        console.log('Form submitted:', {
            ...formData,
            categoryCode,
        })
        e.preventDefault(); 
        if(categoryCode === 'O') {
    const updatedFormData = {
        ...formData,
        jeeAdvancedCategoryRank: 0,
        jeeMainsCategoryRank: 0
    };
    setFormData(updatedFormData);
    
    // Also save to localStorage
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('jeeFormData', JSON.stringify(updatedFormData));
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    }
}
        const params = new URLSearchParams({
        resver: categoryCode,
        gend: formData.gender === 'male' ? 'M' : 'F',
        adv: formData.jeeAdvancedQualified === 'yes' ? (categoryCode !== 'O' ? formData.jeeAdvancedCategoryRank : formData.jeeAdvancedRank) : '0',
        main: categoryCode !== 'O' ? formData.jeeMainsCategoryRank : formData.jeeMainsRank
  });

  try {
    console.log('Fetching data with params:', params.toString());
    const response = await fetch(`https://api-josaacounselling22.vercel.app/api/search?${params.toString()}`);
    const data = await response.json();
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('data', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving API response:', error);
        }
}
    console.log('API response:', data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
    setIsLoading(false);
    router.push('/institutes');
       
    }        
        return (
        <div className="container">
            <h1 className="title">Your Path to Dream College</h1>
            <div className="tagline">Complete the form below to discover your opportunities at top institutions</div>
            
            <form onSubmit={handleSubmit} className="form">
            <div className="form-header">
                <div className="form-icon">🎓</div>
                <h2>JEE Counselling Form</h2>
            </div>
            
            {/* Mobile Navigation */}
            {viewportWidth && viewportWidth < 768 && (
                <div className="mobile-nav">
                <button type="button" className="nav-btn" onClick={() => scrollToSection('personal-info')}>
                    <span className="section-icon">👤</span> Personal Info
                </button>
                <button type="button" className="nav-btn" onClick={() => scrollToSection('ranks-section')}>
                    <span className="section-icon">🏆</span> Ranks
                </button>
                </div>
            )}
            
            {/* Selection Fields Section */}
            <div id="personal-info" className="selection-section">
                <h3><span className="section-icon">👤</span> Personal Information</h3>
                
                <div className="form-group">
                <label htmlFor="jeeAdvancedQualified">JEE Advanced Qualification Status:</label>
                <select 
                    id="jeeAdvancedQualified" 
                    name="jeeAdvancedQualified" 
                    value={formData.jeeAdvancedQualified}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Status</option>
                    <option value="yes">Qualified</option>
                    <option value="no">Not Qualified</option>
                </select>
                </div>

                <div className="form-group">
                <label htmlFor="gender">Gender:</label>
                <select 
                    id="gender" 
                    name="gender" 
                    value={formData.gender}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                </div>

                <div className="form-group checkbox-group">
                <label htmlFor="isPwd" className="checkbox-label">
                    <input 
                    type="checkbox" 
                    id="isPwd" 
                    name="isPwd" 
                    checked={formData.isPwd}
                    onChange={handleChange}
                    />
                    Person with Disability (PwD)
                </label>
                </div>

                <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select 
                    id="category" 
                    name="category" 
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Category</option>
                    <option value="general">{formData.isPwd ? "General (PwD)" : "General"}</option>
                    <option value="obc">{formData.isPwd ? "OBC-NCL (PwD)" : "OBC-NCL"}</option>
                    <option value="sc">{formData.isPwd ? "SC (PwD)" : "SC"}</option>
                    <option value="st">{formData.isPwd ? "ST (PwD)" : "ST"}</option>
                    <option value="ews">{formData.isPwd ? "EWS (PwD)" : "EWS"}</option>
                </select>
                </div>
            </div>

            {/* Rank Fields Section */}
            <div id="ranks-section" className="ranks-container">
                <h3><span className="section-icon">🏆</span> Examination Ranks</h3>
            
                {/* JEE Mains Rank Fields */}
                <div className="rank-section">
                <h4><span className="section-icon">📊</span> JEE Mains Ranks</h4>
                <div className="form-group">
                    <label htmlFor="jeeMainsRank">JEE Mains Rank (CRL):</label>
                    <input 
                    type="number" 
                    id="jeeMainsRank" 
                    name="jeeMainsRank" 
                    value={formData.jeeMainsRank}
                    onChange={handleChange}
                    min="1"
                    placeholder="Enter your JEE Mains CRL"
                    inputMode="numeric" 
                    required
                    />
                </div>

                {isNonGeneralCategory() && (
                    <div className="form-group">
                    <label htmlFor="jeeMainsCategoryRank">JEE Mains Category Rank:</label>
                    <input 
                        type="number" 
                        id="jeeMainsCategoryRank" 
                        name="jeeMainsCategoryRank" 
                        value={formData.jeeMainsCategoryRank}
                        onChange={handleChange}
                        min="1"
                        placeholder="Enter your category rank"
                        inputMode="numeric"
                        required
                    />
                    </div>
                )}
                </div>

                {/* JEE Advanced Rank Fields */}
                {formData.jeeAdvancedQualified === 'yes' && (
                <div className="rank-section">
                    <h4><span className="section-icon">🌟</span> JEE Advanced Ranks</h4>
                    <div className="form-group">
                    <label htmlFor="jeeAdvancedRank">JEE Advanced Rank (CRL):</label>
                    <input 
                        type="number" 
                        id="jeeAdvancedRank" 
                        name="jeeAdvancedRank" 
                        value={formData.jeeAdvancedRank}
                        onChange={handleChange}
                        min="1"
                        placeholder="Enter your JEE Advanced CRL"
                        inputMode="numeric"
                        required
                    />
                    </div>

                    {isNonGeneralCategory() && (
                    <div className="form-group">
                        <label htmlFor="jeeAdvancedCategoryRank">JEE Advanced Category Rank:</label>
                        <input 
                        type="number" 
                        id="jeeAdvancedCategoryRank" 
                        name="jeeAdvancedCategoryRank" 
                        value={formData.jeeAdvancedCategoryRank}
                        onChange={handleChange}
                        min="1"
                        placeholder="Enter your category rank"
                        inputMode="numeric"
                        required
                        />
                    </div>
                    )}
                </div>
                )}
            </div>                
            <div className="form-footer">
                <div className="save-status">
                {isSaved && <p className="saved-indicator"><span className="save-icon">✓</span> Form data saved</p>}
                </div>
                <p className="form-note">Your dream college is just a step away!</p>
                <div className="button-group">
                <button 
                    type="submit" 
                    className="submit-btn" 
                    disabled={isLoading}
                    onClick={handleSubmit}
                >
                    {isLoading ? 'Finding Colleges...' : 'Find My Dream College'}
                </button>
                </div>
            </div>
            </form>
        </div>
        );
}
