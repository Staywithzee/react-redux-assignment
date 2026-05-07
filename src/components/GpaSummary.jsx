// src/components/GpaSummary.jsx — Session 3 version (no props)
import { useSelector } from "react-redux";
import {
  selectStudentCount,
  selectAverageGpa,
  selectHighAchievers,
} from "../features/students/selectors";

function GpaSummary() {
  // Each useSelector is independent — only re-renders if its value changes
  const count = useSelector(selectStudentCount);
  const avgGpa = useSelector(selectAverageGpa);
  const highList = useSelector(selectHighAchievers);

  return (
    <div className="gpa-summary">
      <div className="stat-card">
        <span className="stat-value">{count}</span>
        <span className="stat-label">👥 Total Students</span>
      </div>
      <div className="stat-card highlight">
        <span className="stat-value">{avgGpa}</span>
        <span className="stat-label">📊 Average GPA</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{highList.length}</span>
        <span className="stat-label">🏆 High Achievers (≥3.5)</span>
      </div>
    </div>
  );
}

export default GpaSummary;
