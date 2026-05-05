// src/components/StudentTable.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteStudent } from '../features/students/studentsSlice';

function StudentTable() {
  const students = useSelector((state) => state.students);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      dispatch(deleteStudent(id));
    }
  };

  if (students.length === 0) {
    return (
      <div className="student-table-container">
        <p className="empty-state">No students yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="student-table-container">
      <table className="student-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Student ID</th>
            <th>Major</th>
            <th>GPA</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.id} className={student.gpa >= 3.5 ? "high-gpa" : ""}>
              <td>{index + 1}</td>
              <td style={{ fontWeight: 500 }}>{student.name}</td>
              <td>{student.studentId}</td>
              <td>{student.major}</td>
              <td className="gpa-cell">
                <span style={{ 
                  color: student.gpa >= 3.5 ? '#059669' : student.gpa < 2.5 ? '#dc2626' : 'inherit'
                }}>
                  {student.gpa.toFixed(2)}
                </span>
              </td>
              <td>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDelete(student.id)}
                  title="Delete Student"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
