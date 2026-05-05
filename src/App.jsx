// src/App.jsx
import React from 'react';
import './App.css';
import StudentTable from './components/StudentTable';
import GpaSummary from './components/GpaSummary';
import AddStudentForm from './components/AddStudentForm';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AcadeMate</h1>
        <p>Premium Academic Performance Analytics & Student Management System</p>
      </header>

      <main className="app-main">
        <GpaSummary />
        
        <AddStudentForm />
        
        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--text-main)' }}>
            Student Roster
          </h2>
          <StudentTable />
        </section>
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <p>&copy; {new Date().getFullYear()} AcadeMate. Built for React-Redux 24-Hour Training.</p>
      </footer>
    </div>
  );
}

export default App;
