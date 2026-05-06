export default function SubjectCard({ title, progress }) {
  return (
    <div className="card">
      <h4>{title}</h4>

      <div className="progress">
        <div className="bar" style={{ width: progress + "%" }}></div>
      </div>

      <p>{progress}%</p>
    </div>
  );
}