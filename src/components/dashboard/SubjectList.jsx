import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubjectCard from "./SubjectCard";
import { getSubjects } from "../../services/subject.services";

export default function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setSubjects([]);
        return;
      }

      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Load subjects failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="section-header">
        <h3>Môn học của tôi</h3>
        <button onClick={() => navigate("/mysubjects")}>Xem tất cả</button>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : subjects.length === 0 ? (
        <p>Chưa có môn học nào.</p>
      ) : (
        <div className="subject-grid">
          {subjects.map((item) => (
            <SubjectCard key={item.subjectId} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}