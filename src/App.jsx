// src/App.jsx
import React, { useState } from 'react';
import './App.css';
import StudentTable from './components/StudentTable';
import GpaSummary from './components/GpaSummary';
import AddStudentForm from './components/AddStudentForm';

// Hard-coded initial data — Session 2 will move this into the Redux store
const INITIAL_STUDENTS = [
  { id: 1, name: 'Somchai Rakpong', studentId: '6501001', major: 'Computer Science', gpa: 3.85 },
  { id: 2, name: 'Naree Thongdee', studentId: '6501002', major: 'Information Technology', gpa: 3.60 },
  { id: 3, name: 'Krit Suwan', studentId: '6501003', major: 'Computer Science', gpa: 2.95 },
  { id: 4, name: 'Malee Jaikaew', studentId: '6501004', major: 'Business IT', gpa: 3.40 },
  { id: 5, name: 'Pong Srisuk', studentId: '6501005', major: 'Information Technology', gpa: 3.75 },
];

function App() {
  // All state lives here — App is the single source of truth (for now)
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  function handleAddStudent(newStudent) {
    setStudents([...students, newStudent]); // Immutable update — no .push()!
  }

  function handleDeleteStudent(studentId) {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== studentId));
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AcadeMate</h1>
        <p>Student Academic Performance Tracker — Session 1 Prototype</p>
      </header>

      <main className="app-main">
        <GpaSummary students={students} />
        
        <AddStudentForm onAddStudent={handleAddStudent} />
        
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--text-main)' }}>
            Student Roster
          </h2>
          <StudentTable 
            students={students} 
            onDeleteStudent={handleDeleteStudent} 
          />
        </section>
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <p>&copy; {new Date().getFullYear()} AcadeMate. Built for React-Redux 24-Hour Training.</p>
      </footer>
    </div>
  );
}

export default App;
