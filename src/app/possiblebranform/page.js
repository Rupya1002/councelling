'use client';
import React, { useState, useEffect } from 'react';
import './possiblebranchform.css';

const defaultFormState = {
  instituteType: '',
  instituteId: '',
  isFromInstituteState: false,
  isPwd: false,
  category: '',
  rank: '',
  gender: '',
};

export default function PossibleBranchForm() {
  const [formData, setFormData] = useState(defaultFormState);
  const [institutesList, setInstitutesList] = useState([]);
  const [allInstitutes, setAllInstitutes] = useState({ IIT: [], NIT: [], IIIT: [], GFTI: [] });
  const [instituteState, setInstituteState] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load and process CSV for institutes
  useEffect(() => {
    async function fetchAndProcessCSV() {
      try {
        const response = await fetch('/state.csv');
        const csvText = await response.text();
        const lines = csvText.split('\n').filter(Boolean);
        const header = lines[0].split(',');
        const data = lines.slice(1).map(line => {
          // Handle quoted commas
          const match = line.match(/("[^"]*"|[^,]+)/g);
          return header.reduce((obj, key, idx) => {
            let val = match[idx];
            if (val && val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            obj[key.trim()] = val ? val.trim() : '';
            return obj;
          }, {});
        });
        // Group by type
        const grouped = { IIT: [], NIT: [], IIIT: [], GFTI: [] };
        data.forEach(row => {
          if (grouped[row.Type]) {
            grouped[row.Type].push({ id: row.Id, name: row.Institute, state: row.State });
          }
        });
        setAllInstitutes(grouped);
      } catch (error) {
        setAllInstitutes({ IIT: [], NIT: [], IIIT: [], GFTI: [] });
      }
    }
    fetchAndProcessCSV();
  }, []);

  // Load saved form data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('possibleBranchForm');
        if (saved) setFormData(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Save form data with debounce
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };
    setFormData(newFormData);
    setIsSaved(false);
    if (window.saveTimeout) clearTimeout(window.saveTimeout);
    window.saveTimeout = setTimeout(() => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('possibleBranchForm', JSON.stringify(newFormData));
          setIsSaved(true);
        } catch {}
      }
    }, 400);
  };

  // Update institutes list and reset selection when type changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, instituteId: '', isFromInstituteState: false }));
    if (formData.instituteType && allInstitutes[formData.instituteType]) {
      setInstitutesList(allInstitutes[formData.instituteType]);
    } else {
      setInstitutesList([]);
    }
    setInstituteState('');
  }, [formData.instituteType, allInstitutes]);

  // Update state of selected institute
  useEffect(() => {
    if (formData.instituteId && institutesList.length > 0) {
      const found = institutesList.find(inst => inst.id === formData.instituteId);
      setInstituteState(found ? found.state : '');
    } else {
      setInstituteState('');
    }
  }, [formData.instituteId, institutesList]);

  // Category options
  const categoryOptions = [
    { value: 'O', label: formData.isPwd ? 'General (PwD)' : 'General' },
    { value: 'ON', label: formData.isPwd ? 'OBC-NCL (PwD)' : 'OBC-NCL' },
    { value: 'SC', label: formData.isPwd ? 'SC (PwD)' : 'SC' },
    { value: 'ST', label: formData.isPwd ? 'ST (PwD)' : 'ST' },
    { value: 'E', label: formData.isPwd ? 'EWS (PwD)' : 'EWS' },
  ];

  // ...existing code...
const handleSubmit = (e) => {
  e.preventDefault();
  console.log('Form Data:', formData);

  // Validate required fields
  if (!formData.instituteId || !formData.gender || !formData.category) {
    console.error('Missing required fields');
    return;
  }

  // Use a separator for clarity
  const url = [
    formData.instituteId,
    formData.gender,
    formData.isFromInstituteState ? 'H' : 'I',
    formData.category,
    formData.isPwd ? 'P' : ''
  ].filter(Boolean).join('');

  fetch(`https://api-josaacounselling22.vercel.app/api/check?id=${url}`)
    .then(response => response.json())
    .then(data => {
      if (data){
        console.log('Possible branches:', data);
        localStorage.setItem('possibleBranches', JSON.stringify(data));
        
      }
    });
  };

  return (
    <div className="container">
      <h1 className="title">Possible Branch Predictor</h1>
      <div className="tagline">Find your possible branches by filling the form below</div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-header">
          <div className="form-icon">🏫</div>
          <h2>Branch Prediction Form</h2>
        </div>
        <div className="selection-section">
          <div className="form-group">
            <label htmlFor="instituteType">Institute Type: <span className="required">*</span></label>
            <select
              id="instituteType"
              name="instituteType"
              value={formData.instituteType}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="IIT">IIT</option>
              <option value="NIT">NIT</option>
              <option value="IIIT">IIIT</option>
              <option value="GFTI">GFTI</option>
            </select>
          </div>

          {formData.instituteType && (
            <div className="form-group">
              <label htmlFor="instituteId">
                Institute: <span className="required">*</span>
              </label>
              <select
                id="instituteId"
                name="instituteId"
                value={formData.instituteId}
                onChange={handleChange}
                required
              >
                <option value="">Select Institute</option>
                {institutesList.map((inst) => (
                  <option key={inst.id} value={inst.id}>{inst.name}</option>
                ))}
              </select>
            </div>
          )}

          {formData.instituteId && instituteState && formData.instituteType !== 'IIT' && (
            <div className="form-group-checkbox-group">
              <label htmlFor="isFromInstituteState" className="checkbox-label">
                <input
                  type="checkbox"
                  id="isFromInstituteState"
                  name="isFromInstituteState"
                  checked={formData.isFromInstituteState}
                  onChange={handleChange}
                  className="checkbox-input"
                />
              </label>
              <span className="person">Are you from <b>{instituteState}</b>?</span>
            </div>
          )}

          <div className="form-group-checkbox-group">
            <label htmlFor="isPwd" className="checkbox-label">
              <input
                type="checkbox"
                id="isPwd"
                name="isPwd"
                checked={formData.isPwd}
                onChange={handleChange}
                className="checkbox-input"
              />
            </label>
            <p className="person">Person with Disability (PwD)</p>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category: <span className="required">*</span></label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {categoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender: <span className="required">*</span></label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
        </div>

        <div className="ranks-container">
          <h3><span className="section-icon">🏆</span> Examination Rank</h3>
          <div className="rank-section">
            <label htmlFor="rank">
              {formData.instituteType === 'IIT' ? 'JEE Advanced Rank' : 'JEE Mains Rank'}: <span className="required">*</span>
            </label>
            <input
              type="number"
              id="rank"
              name="rank"
              value={formData.rank}
              onChange={handleChange}
              min="1"
              placeholder={formData.instituteType === 'IIT' ? 'Enter your JEE Advanced Rank' : 'Enter your JEE Mains Rank'}
              inputMode="numeric"
              required
            />
          </div>
          {formData.category && (
            <div className="form-group">
              <label>Selected Category:</label>
              <div>{categoryOptions.find((cat) => cat.value === formData.category)?.label}</div>
            </div>
          )}
          {/* Show gender and home state if checkbox checked */}
          {(formData.gender || (formData.isFromInstituteState && instituteState)) && (
            <div className="form-group">
              {formData.gender && (
                <div>Gender: <b>{formData.gender === 'M' ? 'Male' : 'Female'}</b></div>
              )}
              {formData.isFromInstituteState && instituteState && (
                <div>Home State: <b>{instituteState}</b></div>
              )}
            </div>
          )}
        </div>
        <div className="form-footer">
          <div className="save-status">
            {isSaved && <p className="saved-indicator"><span className="save-icon">✓</span> Form data saved</p>}
          </div>
          <p className="form-note">Your possible branches are just a step away!</p>
          <div className="button-group">
            <button type="submit" className="submit-btn" disabled={isLoading}>
              Find Possible Branches
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}