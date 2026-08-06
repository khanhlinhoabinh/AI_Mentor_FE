import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ReminderCalendar.css";
import useReminderCalendar from "./useReminderCalendar";

/**
 * ReminderCalendar
 * @param {{ onCreated?: () => void }} props - truyền onCreated khi muốn
 * refresh danh sách sau khi tạo (VD: RemindersPage). HomePage không cần
 * truyền gì, hành vi giữ nguyên như cũ.
 */
export default function ReminderCalendar({ onCreated }) {
  const {
    selectedDate,
    setSelectedDate,
    content,
    setContent,
    isSubmitting,
    handleSubmit,
  } = useReminderCalendar({ onSuccess: onCreated });

  return (
    <div className="panel-card reminder-panel-card">
      <div className="panel-header">
        <h3>Tạo lịch nhắc nhở</h3>
      </div>

      <div className="reminder-calendar-wrapper">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          inline
          calendarClassName="reminder-datepicker"
          minDate={new Date()}
        />
      </div>

      <textarea
        className="reminder-textarea"
        placeholder={"Ví dụ:\nReview báo cáo\nÔn tập Java\nLàm Quiz"}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
      />

      <button
        className="reminder-submit-btn"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Đang tạo..." : "Tạo lịch nhắc"}
      </button>
    </div>
  );
}