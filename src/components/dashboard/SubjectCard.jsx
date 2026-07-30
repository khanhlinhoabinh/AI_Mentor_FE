import { BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SubjectCard({ item }) {
  const navigate = useNavigate();

  return (
    <div className="subject-card">
      <div className="subject-icon">
        <BookOpen size={26} />
      </div>

      <h4>{item.subjectName}</h4>

      <button
        className="subject-continue-btn"
        onClick={() => navigate(`/mysubjects/${item.subjectId}`)}
      >
        Tiếp tục học <ArrowRight size={14} />
      </button>
    </div>
  );
}