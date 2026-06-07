export const subjectData = {
  id: 1,
  name: "Cấu trúc dữ liệu và giải thuật",
  category: "Computer Science",
  totalDocs: 12,
  updatedAt: "20/05/2024",
  description:
    "Môn học này giúp bạn nắm vững các cấu trúc dữ liệu cơ bản và thuật toán để giải quyết các bài toán lập trình hiệu quả.",
  initials: "</>",
  color: "#22C55E",
  students: 3,
  progress: {
    overall: 65,
    completed: 65,
    inProgress: 20,
    notStarted: 15,
  },
};

export const documents = [
  {
    id: 1,
    name: "Giáo trình CTDL & Giải thuật",
    size: "2.4 MB",
    type: "PDF",
    readPercent: 80,
    icon: "pdf",
  },
  {
    id: 2,
    name: "Bài tập chương 1-5",
    size: "1.1 MB",
    type: "DOCX",
    readPercent: 45,
    icon: "docx",
  },
  {
    id: 3,
    name: "Slide bài giảng chương 3",
    size: "5.6 MB",
    type: "PDF",
    readPercent: 60,
    icon: "pdf",
  },
  {
    id: 4,
    name: "Thuật toán sắp xếp",
    size: "3.2 MB",
    type: "PPTX",
    readPercent: 30,
    icon: "pptx",
  },
  {
    id: 5,
    name: "Đề thi giữa kỳ 2023",
    size: "1.8 MB",
    type: "PDF",
    readPercent: 3,
    icon: "pdf",
  },
];

export const roadmap = [
  {
    id: 1,
    title: "Chương 1",
    subtitle: "Tổng quan",
    status: "completed",
    note: "Hoàn thành",
  },
  {
    id: 2,
    title: "Chương 2",
    subtitle: "Mảng & Danh sách",
    status: "completed",
    note: "Hoàn thành",
  },
  {
    id: 3,
    title: "Chương 3",
    subtitle: "Ngăn xếp & Hàng đợi",
    status: "in-progress",
    note: "Đang học 60%",
  },
  {
    id: 4,
    title: "Chương 4",
    subtitle: "Cây nhị phân",
    status: "locked",
    note: "Chưa học",
  },
  {
    id: 5,
    title: "Chương 5",
    subtitle: "Đồ thị",
    status: "locked",
    note: "Chưa học",
  },
  {
    id: 6,
    title: "Ôn tập &",
    subtitle: "Bài tập tổng hợp",
    status: "locked",
    note: "Chưa học",
  },
];

export const activities = [
  {
    id: 1,
    text: 'Bạn đã đọc Giáo trình CTDL & Giải thuật',
    time: "2 giờ trước",
    type: "doc",
  },
  {
    id: 2,
    text: 'Bạn đã hỏi Chat AI về "Độ phức tạp thuật toán"',
    time: "Hôm qua",
    type: "chat",
  },
  {
    id: 3,
    text: "Bạn đã tạo ghi chú mới",
    time: "2 ngày trước",
    type: "note",
  },
];

export const reminders = [
  {
    id: 1,
    title: "Bài tập chương 3",
    deadline: "Hạn nộp: 25/05/2024",
    status: "urgent",
    statusLabel: "Sắp đến hạn",
  },
  {
    id: 2,
    title: "Ôn tập giữa kỳ",
    deadline: "24/05/2024 19:30",
    status: "soon",
    statusLabel: "Sắp diễn ra",
  },
];

export const achievements = [
  { id: 1, icon: "🔥", value: "12", label: "Ngày học liên tục" },
  { id: 2, icon: "🏆", value: "8/12", label: "Chương đã hoàn thành" },
  { id: 3, icon: "💎", value: "850", label: "Điểm kinh nghiệm" },
  { id: 4, icon: "🎖️", value: "Học sinh Chăm chỉ", label: "Cấp độ hiện tại" },
];

export const progressChart = [
  { name: "T2", value: 20 },
  { name: "T3", value: 35 },
  { name: "T4", value: 28 },
  { name: "T5", value: 50 },
  { name: "T6", value: 42 },
  { name: "T7", value: 58 },
  { name: "CN", value: 65 },
];