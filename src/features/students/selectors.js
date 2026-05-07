// src/features/students/selectors.js
// ── Basic selectors ───────────────────────────────────────
// Select the full list of students from the store
export const selectAllStudents = (state) => state.students.list;
// Select total count
export const selectStudentCount = (state) => state.students.list.length;

// Select async loading status and error
export const selectStudentsStatus = (state) => state.students.status;
export const selectStudentsError = (state) => state.students.error;

// ── Derived / computed selectors ─────────────────────────
// Compute average GPA across all students
export const selectAverageGpa = (state) => {
  const list = state.students.list;
  if (list.length === 0) return "0.00";
  const total = list.reduce((sum, s) => sum + s.gpa, 0);
  return (total / list.length).toFixed(2);
};

// Find a single student by id (useful for edit modal)
export const selectStudentById = (id) => (state) => state.students.list.find((s) => s.id === id);

// Count students above a GPA threshold
export const selectHighAchievers = (state) => state.students.list.filter((s) => s.gpa >= 3.5);
