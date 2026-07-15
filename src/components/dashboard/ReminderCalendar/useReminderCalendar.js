import { useState } from "react";
import { toast } from "react-toastify"; // TODO: đổi sang lib toast thật của project nếu khác
import { createReminder } from "../../../services/reminder.services";

/**
 * useReminderCalendar
 * Toàn bộ logic của card "Tạo lịch nhắc nhở":
 * - quản lý ngày chọn
 * - quản lý nội dung
 * - validate
 * - gọi API
 * - clear form khi thành công
 *
 * Component chỉ nhận state + handler qua return, không tự chứa logic.
 */
export default function useReminderCalendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setSelectedDate(null);
    setContent("");
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      toast.error("Vui lòng chọn ngày nhắc nhở.");
      return;
    }

    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung nhắc nhở.");
      return;
    }

    const reminderDate = formatDate(selectedDate);

    try {
      setIsSubmitting(true);

      await createReminder({
        title: content.trim(),
        reminderDate,
      });

      toast.success("Đã tạo lịch nhắc thành công.");
      resetForm();
    } catch (error) {
      console.error("Create reminder failed:", error);
      toast.error("Tạo lịch nhắc thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    content,
    setContent,
    isSubmitting,
    handleSubmit,
  };
}

/**
 * Format Date -> "yyyy-MM-dd" (đúng chuẩn backend yêu cầu)
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}