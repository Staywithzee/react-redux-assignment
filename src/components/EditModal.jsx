// src/components/EditModal.jsx — Session 3
import React, { useState } from 'react';

function EditModal({ student, onSave, onCancel }) {
  // Local copy of student data — what the user edits before saving
  const [form, setForm] = useState({ ...student });

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Student Details</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label>Full Name</label>
            <input 
              name="name" 
              value={form.name} 
              onChange={onChange} 
              required 
            />
          </div>
          
          <div className="modal-field">
            <label>Major</label>
            <input 
              name="major" 
              value={form.major || ''} 
              onChange={onChange} 
            />
          </div>
          
          <div className="modal-field">
            <label>GPA</label>
            <input 
              name="gpa" 
              value={form.gpa} 
              onChange={onChange} 
              type="number" 
              step="0.01" 
              min="0" 
              max="4" 
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-save">Save Changes</button>
            <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
