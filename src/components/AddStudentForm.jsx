// src/components/AddStudentForm.jsx
import React, { useState } from 'react';

const EMPTY_FORM = { name: '', studentId: '', major: '', gpa: '' };

function AddStudentForm({ onAddStudent }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  // Single handler for ALL inputs via computed property name
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.studentId.trim()) {
      setError('Name and Student ID are required.');
      return;
    }

    const gpaNum = parseFloat(formData.gpa);
    if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4.0) {
      setError('GPA must be a number between 0.0 and 4.0.');
      return;
    }

    onAddStudent({
      id: Date.now(), // Temporary ID — Session 4 uses API-generated IDs
      name: formData.name.trim(),
      studentId: formData.studentId.trim(),
      major: formData.major.trim() || 'Undeclared',
      gpa: gpaNum,
    });

    setFormData(EMPTY_FORM); // Reset form after successful submit
    setError('');
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>Add New Student</h3>
      {error && <p className="form-error">{error}</p>}
      <div className="form-row">
        <input 
          name="name" 
          placeholder="Full Name *" 
          value={formData.name} 
          onChange={handleChange} 
        />
        <input 
          name="studentId" 
          placeholder="Student ID *" 
          value={formData.studentId} 
          onChange={handleChange} 
        />
        <input 
          name="major" 
          placeholder="Major" 
          value={formData.major} 
          onChange={handleChange} 
        />
        <input 
          name="gpa" 
          placeholder="GPA (0.0–4.0)" 
          value={formData.gpa} 
          onChange={handleChange}
          type="number" 
          step="0.01" 
          min="0" 
          max="4" 
        />
        <button type="submit" className="btn-primary">+ Add Student</button>
      </div>
    </form>
  );
}

export default AddStudentForm;
