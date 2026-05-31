import SubjectCard from "./SubjectCard";

export default function SubjectList() {
  const subjects = [
    {
      title: "Cấu trúc dữ liệu & Giải thuật",
      progress: 65,
      docs: 12,
      icon: "⚙️",
    },
    {
      title: "Cơ sở dữ liệu",
      progress: 40,
      docs: 8,
      icon: "🗄️",
    },
    {
      title: "Trí tuệ nhân tạo",
      progress: 75,
      docs: 15,
      icon: "🤖",
    },
    {
      title: "Toán rời rạc",
      progress: 30,
      docs: 6,
      icon: "📐",
    },
  ];

  return (
    <section className="section">
      <div className="section-header">
        <h3>Môn học của tôi</h3>

        <button>Xem tất cả</button>
      </div>

      <div className="subject-grid">
        {subjects.map((item, index) => (
          <SubjectCard
            key={index}
            item={item}
          />
        ))}
      </div>
    </section>
  );
}