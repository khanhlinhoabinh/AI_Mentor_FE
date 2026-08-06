import { useState } from "react";
import { toast } from "react-toastify";
import { createReminder } from "../../../services/reminder.services";

/**
 * useReminderCalendar
 * @param {{ onSuccess?: () => void }} options - onSuccess được gọi sau khi
 * tạo lịch thành công, dùng để trang cha (VD: RemindersPage) refresh danh sách.
 * Không truyền vẫn hoạt động như cũ (HomePage không cần đổi gì).
 */
export default function useReminderCalendar({ onSuccess } = {}) {
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
      onSuccess?.();
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

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}