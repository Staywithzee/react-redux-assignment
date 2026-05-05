import React from 'react';
import { useSelector } from 'react-redux';

function GpaSummary() {
  const students = useSelector((state) => state.students);

  if (students.length === 0) return null;

  const average = (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2);
  const highest = Math.max(...students.map(s => s.gpa)).toFixed(2);
  const lowest = Math.min(...students.map(s => s.gpa)).toFixed(2);

  return (
    <div className="gpa-summary">
      <div className="stat-card">
        <span className="stat-label">Students</span>
        <span className="stat-value">{students.length}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Avg GPA</span>
        <span className="stat-value">{average}</span>
      </div>
      <div className="stat-card highlight">
        <span className="stat-label">Highest</span>
        <span className="stat-value">{highest}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Lowest</span>
        <span className="stat-value">{lowest}</span>
      </div>
    </div>
  );
}

export default GpaSummary;
