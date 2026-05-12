// src/components/StudentTable.jsx — Session 5
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteStudentAsync,
  updateStudentAsync,
  fetchStudents,
  IS_PLACEHOLDER
} from "../features/students/studentsThunks";
import {
  selectAllStudents,
  selectStudentById,
} from "../features/students/studentsSlice";
import {
  selectStudentsStatus,
  selectStudentsError
} from "../features/students/selectors";
import EditModal from "./EditModal";

// O(1) per-row lookup via entity adapter — only re-renders when this student changes
function StudentRow({ id, index, onEdit, onDelete }) {
  const student = useSelector(state => selectStudentById(state, id));

  return (
    <tr key={student.id} className={student.gpa >= 3.5 ? "high-gpa" : ""}>
      <td>{index + 1}</td>
      <td style={{ fontWeight: 500 }}>{student.name}</td>
      <td>{student.studentId}</td>
      <td>{student.major || "Undeclared"}</td>
      <td className="gpa-cell">
        <span style={{
          color: student.gpa >= 3.5 ? 'var(--success)' : student.gpa < 2.5 ? 'var(--danger)' : 'inherit',
          fontWeight: student.gpa >= 3.5 ? 600 : 'normal'
        }}>
          {student.gpa.toFixed(2)}
        </span>
      </td>
      <td style={{ textAlign: 'center' }}>
        {student.gpa >= 3.5 ? (
          <span className="status-pill status-honors">🏆 เกียรตินิยม</span>
        ) : student.gpa < 2.5 ? (
          <span className="status-pill status-warning">⚠️ เฝ้าระวัง</span>
        ) : (
          <span className="status-pill status-normal">✓ ปกติ</span>
        )}
      </td>
      <td style={{ textAlign: 'center' }}>
        {IS_PLACEHOLDER ? (
          <span className="sync-pill">💾 Local</span>
        ) : (
          <span className="sync-pill sync-pill-online">⚡ Cloud</span>
        )}
      </td>
      <td>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn-edit"
            onClick={() => onEdit(student)}
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
            onClick={() => onDelete(student.id)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

function StudentTable() {
  const dispatch = useDispatch();
  const students = useSelector(selectAllStudents);
  const status = useSelector(selectStudentsStatus);
  const error = useSelector(selectStudentsError);

  // Local UI state — modal open/close and editing
  const [editing, setEditing] = useState(null);

  // Advanced Filtering State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("all");
  const [selectedGpa, setSelectedGpa] = useState("all");

  function handleDelete(id) {
    if (window.confirm("ต้องการลบนักศึกษาคนนี้ใช่หรือไม่?")) {
      dispatch(deleteStudentAsync(id));
    }
  }

  function handleEditSave(updatedData) {
    dispatch(updateStudentAsync({ ...updatedData, gpa: parseFloat(updatedData.gpa) || 0 }));
    setEditing(null);
  }

  // Extract dynamically unique majors for dropdown filter
  const uniqueMajors = Array.from(new Set(students.map(s => s.major))).filter(Boolean);

  // Apply filters and collect ids for StudentRow
  const filteredIds = students
    .filter(student => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMajor = selectedMajor === "all" || student.major === selectedMajor;

      let matchesGpa = true;
      if (selectedGpa === "honors") matchesGpa = student.gpa >= 3.5;
      else if (selectedGpa === "normal") matchesGpa = student.gpa >= 2.5 && student.gpa < 3.5;
      else if (selectedGpa === "warning") matchesGpa = student.gpa < 2.5;

      return matchesSearch && matchesMajor && matchesGpa;
    })
    .map(s => s.id);

  // Export filtered list to CSV format
  const handleExportCSV = () => {
    if (filteredIds.length === 0) {
      alert("ไม่มีข้อมูลที่จะส่งออก");
      return;
    }
    const filteredStudents = students.filter(s => filteredIds.includes(s.id));
    const headers = ["ID", "Name", "Student ID", "Major", "GPA", "Academic Status", "Sync Status"];
    const rows = filteredStudents.map(s => {
      const academicStatus = s.gpa >= 3.5 ? "Honors" : s.gpa < 2.5 ? "Warning" : "Normal";
      const syncStatus = IS_PLACEHOLDER ? "Local" : "Cloud";
      return [
        s.id,
        `"${s.name.replace(/"/g, '""')}"`,
        s.studentId,
        s.major || "Undeclared",
        s.gpa.toFixed(2),
        academicStatus,
        syncStatus
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `acadestate_students_roster_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (status === 'loading') {
    return (
      <div className="status-container">
        <div className="spinner"></div>
        <p>กำลังโหลดรายชื่อนักศึกษาจากฐานข้อมูล...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="status-container error-banner">
        <div className="error-icon">⚠️</div>
        <p style={{ color: 'var(--danger)', fontWeight: 500 }}>การเชื่อมต่อล้มเหลว: {error}</p>
        <button className="btn-retry" onClick={() => dispatch(fetchStudents())}>
          🔄 ลองเชื่อมต่อใหม่อีกครั้ง
        </button>
      </div>
    );
  }

  if (status !== 'succeeded') {
    return null;
  }

  return (
    <>
      {/* 🔍 Search and Filter Dashboard */}
      <div className="filter-card">
        <div className="filter-row">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="ค้นหารายชื่อ หรือ รหัสนักศึกษา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
          >
            <option value="all">สาขาวิชาทั้งหมด</option>
            {uniqueMajors.map(major => (
              <option key={major} value={major}>{major}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={selectedGpa}
            onChange={(e) => setSelectedGpa(e.target.value)}
          >
            <option value="all">สถานะเกรดเฉลี่ยทั้งหมด</option>
            <option value="honors">🏆 เกียรตินิยม (≥ 3.50)</option>
            <option value="normal">✓ ปกติ (2.50 - 3.49)</option>
            <option value="warning">⚠️ เฝ้าระวัง (&lt; 2.50)</option>
          </select>

          <button className="btn-secondary" onClick={handleExportCSV}>
            📤 ส่งออก CSV
          </button>
        </div>
      </div>

      {filteredIds.length === 0 ? (
        <div className="student-table-container" style={{ padding: "3rem", textAlign: "center" }}>
          <p className="empty-state" style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            ไม่พบรายชื่อนักศึกษาที่ตรงตามเงื่อนไขที่ค้นหา 🔍
          </p>
        </div>
      ) : (
        <div className="student-table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ชื่อ-นามสกุล</th>
                <th>รหัสนักศึกษา</th>
                <th>สาขาวิชา</th>
                <th>เกรดเฉลี่ย</th>
                <th style={{ textAlign: 'center' }}>ผลการเรียน</th>
                <th style={{ textAlign: 'center' }}>สถานะซิงค์</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredIds.map((id, index) => (
                <StudentRow
                  key={id}
                  id={id}
                  index={index}
                  onEdit={setEditing}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

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
