// src/App.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchStudents, IS_PLACEHOLDER } from './features/students/studentsThunks';
import './App.css';
import StudentTable from './components/StudentTable';
import GpaSummary from './components/GpaSummary';
import AddStudentForm from './components/AddStudentForm';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AcadeMate</h1>
        <p>Premium Academic Performance Analytics & Student Management System</p>
        <div className="connection-badge-container">
          {IS_PLACEHOLDER ? (
            <span className="badge badge-local">
              <span className="badge-dot"></span> 💾 Offline Fallback (LocalStorage)
            </span>
          ) : (
            <span className="badge badge-online">
              <span className="badge-dot"></span> ⚡ Cloud API Synced (MockAPI)
            </span>
          )}
        </div>
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
