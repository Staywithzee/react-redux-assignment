// src/components/GpaSummary.jsx — Session 6
import { useSelector } from "react-redux";
import { useGetStudentsQuery } from "../features/students/studentsApi";
import { selectAverageGpa, selectHighAchievers } from "../features/students/selectors";

function GpaSummary() {
  const { data: students = [] } = useGetStudentsQuery();
  const count = students.length;
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
