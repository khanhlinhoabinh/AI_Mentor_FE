export const subjects = [
  {
    id: 1,
    name: "Cấu trúc dữ liệu và giải thuật",
    category: "Computer Science",
    progress: 65,
    updatedAt: "20/05/2024",
    initials: "</>",
    color: "#22C55E",
    status: "Đang học",
  },
  {
    id: 2,
    name: "Cơ sở dữ liệu",
    category: "Computer Science",
    progress: 45,
    updatedAt: "18/05/2024",
    initials: "DB",
    color: "#3B82F6",
    status: "Đang học",
  },
  {
    id: 3,
    name: "Trí tuệ nhân tạo",
    category: "Artificial Intelligence",
    progress: 30,
    updatedAt: "15/05/2024",
    initials: "AI",
    color: "#F97316",
    status: "Chưa học",
  },
  {
    id: 4,
    name: "Machine Learning",
    category: "Artificial Intelligence",
    progress: 25,
    updatedAt: "12/05/2024",
    initials: "ML",
    color: "#8B5CF6",
    status: "Chưa học",
  },
  {
    id: 5,
    name: "Phát triển Web",
    category: "Web Development",
    progress: 80,
    updatedAt: "10/05/2024",
    initials: "WD",
    color: "#EF4444",
    status: "Hoàn thành",
  },
  
  
];

export const recentSubjects = [
  {
    id: 1,
    name: "Cấu trúc dữ liệu và giải thuật",
    category: "Computer Science",
    progress: 65,
    lastStudied: "2 giờ trước",
    initials: "</>",
    color: "#22C55E",
  },
  {
    id: 2,
    name: "Cơ sở dữ liệu",
    category: "Computer Science",
    progress: 45,
    lastStudied: "1 ngày trước",
    initials: "DB",
    color: "#3B82F6",
  },
  {
    id: 3,
    name: "Trí tuệ nhân tạo",
    category: "Artificial Intelligence",
    progress: 30,
    lastStudied: "2 ngày trước",
    initials: "AI",
    color: "#F97316",
  },
];

export const overviewStats = {
  totalSubjects: 12,
  avgProgress: 65,
  totalStudyHours: 128.5,
  learningStreak: 8,
};

export const studyProgressData = {
  total: 12,
  completed: { count: 3, percent: 25 },
  inProgress: { count: 6, percent: 50 },
  notStarted: { count: 3, percent: 25 },
};

export const streakData = {
  currentStreak: 8,
  record: 15,
  weeks: [
    {
      label: "T2",
      days: [true, false, true, true, false, true, true],
    },
    {
      label: "T3",
      days: [true, true, true, false, true, true, false],
    },
  ],
  grid: [
    ["T2","T3","T4","T5","T6","T7","CN"],
    [true, true, false, true, true, true, false],
    [false, true, true, true, false, true, true],
  ],
};

export const recentActivities = [
  {
    id: 1,
    text: 'Bạn đã học "Cấu trúc dữ liệu và giải thuật"',
    time: "2 giờ trước",
    type: "study",
  },
  {
    id: 2,
    text: "Bạn đã upload tài liệu mới",
    time: "1 ngày trước",
    type: "upload",
  },
  {
    id: 3,
    text: "Bạn đã đặt câu hỏi cho Chat AI",
    time: "2 ngày trước",
    type: "chat",
  },
];

export const categories = [
  "Tất cả danh mục",
  "Computer Science",
  "Artificial Intelligence",
  "Web Development",
  "Business",
];

export const sortOptions = [
  "Sắp xếp: Mới nhất",
  "Sắp xếp: Cũ nhất",
  "Sắp xếp: Tiến độ",
  "Sắp xếp: Tên A-Z",
];