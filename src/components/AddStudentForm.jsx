// src/components/AddStudentForm.jsx — Session 6
import { useState } from "react";
import { useAddStudentMutation } from "../features/students/studentsApi";

const EMPTY_FORM = { name: "", studentId: "", major: "", gpa: "" };

function AddStudentForm() {
  const [addStudent, { isLoading: isSaving }] = useAddStudentMutation();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.studentId.trim()) {
      setError("Name and Student ID are required.");
      return;
    }

    const gpaNum = parseFloat(form.gpa);
    if (form.gpa && (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4.0)) {
      setError("GPA must be between 0.0 and 4.0.");
      return;
    }

    setError("");

    try {
      await addStudent({
        name: form.name.trim(),
        studentId: form.studentId.trim(),
        major: form.major.trim() || "Undeclared",
        gpa: parseFloat(form.gpa) || 0,
      }).unwrap();

      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err?.data || "Failed to add student.");
    }
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>Add New Student</h3>
      {error && <p className="form-error" style={{ color: "var(--danger)", marginBottom: "1rem", fontSize: "0.875rem" }}>{error}</p>}
      <div className="form-row">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name *"
          required
          disabled={isSaving}
        />
        <input
          name="studentId"
          placeholder="Student ID *"
          value={form.studentId}
          onChange={handleChange}
          required
          disabled={isSaving}
        />
        <input
          name="major"
          placeholder="Major"
          value={form.major}
          onChange={handleChange}
          disabled={isSaving}
        />
        <input
          name="gpa"
          placeholder="GPA (0.0–4.0)"
          value={form.gpa}
          onChange={handleChange}
          type="number"
          step="0.01"
          min="0"
          max="4"
          disabled={isSaving}
        />
        <button type="submit" className="btn-primary" disabled={isSaving}>
          {isSaving ? "Adding..." : "+ Add Student"}
        </button>
      </div>
    </form>
  );
}

export default AddStudentForm;
