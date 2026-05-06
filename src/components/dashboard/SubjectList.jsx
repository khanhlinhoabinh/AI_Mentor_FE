import SubjectCard from "./SubjectCard";
import "./Subject.css";

export default function SubjectList() {
  return (
    <div>
      <h3>Môn học của tôi</h3>

      <div className="subject-grid">
        <SubjectCard title="Cấu trúc dữ liệu" progress={65} />
        <SubjectCard title="Cơ sở dữ liệu" progress={40} />
        <SubjectCard title="AI" progress={75} />
      </div>
    </div>
  );
}