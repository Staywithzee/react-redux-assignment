// src/App.jsx — Session 8
import { lazy, Suspense } from 'react';
import { IS_PLACEHOLDER } from './features/students/studentsApi';
import './App.css';

// Code-split each section — browser loads only what's needed
const GpaSummary    = lazy(() => import('./components/GpaSummary'));
const AddStudentForm = lazy(() => import('./components/AddStudentForm'));
const StudentTable  = lazy(() => import('./components/StudentTable'));

function SectionFallback() {
  return (
    <div className="status-container">
      <div className="spinner"></div>
    </div>
  );
}

function App() {
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
        <Suspense fallback={<SectionFallback />}>
          <GpaSummary />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <AddStudentForm />
        </Suspense>

        <section>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--text-main)' }}>
            Student Roster
          </h2>
          <Suspense fallback={<SectionFallback />}>
            <StudentTable />
          </Suspense>
        </section>
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <p>&copy; {new Date().getFullYear()} AcadeMate. Built for React-Redux 24-Hour Training.</p>
      </footer>
    </div>
  );
}

export default App;
