export const STEPS = [
  { id: 1, label: "Chọn nguồn" },
  { id: 2, label: "AI xử lý" },
  { id: 3, label: "Chỉnh sửa thẻ" },
  { id: 4, label: "Lưu & Học" },
];

export const CURRENT_STEP = 3;

export const CATEGORIES = [
  { value: "cau-truc-du-lieu", label: "Cấu trúc dữ liệu và giải thuật" },
  { value: "lap-trinh-web", label: "Lập trình Web" },
  { value: "co-so-du-lieu", label: "Cơ sở dữ liệu" },
  { value: "mang-may-tinh", label: "Mạng máy tính" },
  { value: "tri-tue-nhan-tao", label: "Trí tuệ nhân tạo" },
];

export const DIFFICULTY_LEVELS = [
  { value: "de", label: "Dễ" },
  { value: "trung-binh", label: "Trung bình" },
  { value: "kho", label: "Khó" },
];

export const FLASHCARD_COLORS = [
  "#8B5CF6",
  "#22C55E",
  "#FACC15",
  "#EC4899",
  "#3B82F6",
  "#06B6D4",
];

export const flashcards = [
  {
    id: 1,
    question: "Cấu trúc dữ liệu là gì?",
    answer:
      "Cấu trúc dữ liệu là cách tổ chức, lưu trữ và quản lý dữ liệu để có thể sử dụng hiệu quả.",
  },
  {
    id: 2,
    question: "Stack là gì?",
    answer:
      "Stack là cấu trúc dữ liệu hoạt động theo nguyên lý LIFO (Last In First Out) – phần tử vào sau sẽ ra trước.",
  },
  {
    id: 3,
    question: "Queue là gì?",
    answer:
      "Queue là cấu trúc dữ liệu hoạt động theo nguyên lý FIFO (First In First Out) – phần tử vào trước sẽ ra trước.",
  },
  {
    id: 4,
    question: "Linked List là gì?",
    answer:
      "Linked List là cấu trúc dữ liệu tuyến tính gồm các node liên kết với nhau, mỗi node chứa dữ liệu và con trỏ đến node tiếp theo.",
  },
  {
    id: 5,
    question: "Binary Tree là gì?",
    answer:
      "Binary Tree là cấu trúc dữ liệu cây mà mỗi node có tối đa 2 node con (con trái và con phải).",
  },
  {
    id: 6,
    question: "Hash Table là gì?",
    answer:
      "Hash Table là cấu trúc dữ liệu lưu trữ dữ liệu dạng key-value, sử dụng hàm hash để ánh xạ key sang vị trí lưu trữ.",
  },
  {
    id: 7,
    question: "Graph là gì?",
    answer:
      "Graph là cấu trúc dữ liệu gồm tập hợp các đỉnh (vertex) và cạnh (edge) kết nối giữa các đỉnh.",
  },
  {
    id: 8,
    question: "Heap là gì?",
    answer:
      "Heap là cấu trúc dữ liệu cây nhị phân đặc biệt, phần tử cha luôn lớn hơn (Max Heap) hoặc nhỏ hơn (Min Heap) phần tử con.",
  },
  {
    id: 9,
    question: "Big O Notation là gì?",
    answer:
      "Big O Notation là ký hiệu toán học dùng để mô tả độ phức tạp của thuật toán theo thời gian hoặc không gian khi đầu vào tăng lên.",
  },
  {
    id: 10,
    question: "Recursion là gì?",
    answer:
      "Recursion (đệ quy) là kỹ thuật lập trình trong đó hàm gọi lại chính nó để giải quyết bài toán con nhỏ hơn.",
  },
  {
    id: 11,
    question: "Dynamic Programming là gì?",
    answer:
      "Dynamic Programming là kỹ thuật tối ưu hóa chia bài toán thành các bài toán con nhỏ hơn và lưu kết quả để tránh tính toán lại.",
  },
  {
    id: 12,
    question: "Sorting Algorithm là gì?",
    answer:
      "Sorting Algorithm là thuật toán sắp xếp các phần tử trong một tập hợp theo thứ tự nhất định (tăng dần hoặc giảm dần).",
  },
];

export const defaultFormData = {
  question: "Cấu trúc dữ liệu là gì?",
  answer:
    "Cấu trúc dữ liệu là cách tổ chức, lưu trữ và quản lý dữ liệu để có thể sử dụng hiệu quả.",
  category: "cau-truc-du-lieu",
  difficulty: "trung-binh",
  tags: ["cấu trúc dữ liệu", "lập trình", "cs"],
  color: "#8B5CF6",
};

export const TABS = [
  { id: "manual", label: "Chỉnh sửa thủ công", icon: "edit" },
  { id: "ai", label: "AI gợi ý", icon: "ai" },
  { id: "bulk", label: "Nhập hàng loạt", icon: "bulk" },
];