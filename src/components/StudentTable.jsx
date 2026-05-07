// src/components/StudentTable.jsx — Session 3 version
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteStudent, updateStudent } from "../features/students/studentsSlice";
import { selectAllStudents } from "../features/students/selectors";
import EditModal from "./EditModal";

function StudentTable() {
  const dispatch = useDispatch();
  const students = useSelector(selectAllStudents);

  // Local UI state — modal open/close and which student is being edited
  const [editing, setEditing] = useState(null); // null = modal closed

  function handleDelete(id) {
    if (window.confirm("Delete this student?")) {
      dispatch(deleteStudent(id));
    }
  }

  function handleEditSave(updatedData) {
    dispatch(updateStudent({ ...updatedData, gpa: parseFloat(updatedData.gpa) || 0 }));
    setEditing(null); // Close modal after update
  }

  if (students.length === 0) {
    return (
      <div className="student-table-container">
        <p className="empty-state" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
          No students yet. Add one above!
        </p>
      </div>
    );
  }

  return (
    <>
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
                    color: student.gpa >= 3.5 ? '#059669' : student.gpa < 2.5 ? '#dc2626' : 'inherit',
                    fontWeight: student.gpa >= 3.5 ? 600 : 'normal'
                  }}>
                    {student.gpa.toFixed(2)}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn-edit" 
                      onClick={() => setEditing(student)}
                      style={{
                        background: 'transparent',
                        color: 'var(--text-main)',
                        border: '1px solid #3f3f46',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(student.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditModal 
          student={editing} 
          onSave={handleEditSave} 
          onCancel={() => setEditing(null)} 
        />
      )}
    </>
  );
}

export default StudentTable;
