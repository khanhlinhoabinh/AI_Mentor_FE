import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ReminderCalendar.css";
import useReminderCalendar from "./useReminderCalendar";

/**
 * ReminderCalendar
 * Thay thế card "Lịch học hôm nay" cũ bằng card "Tạo lịch nhắc nhở"
 * trong RightPanel.
 *
 * Dùng lại nguyên class "panel-card" + "panel-header" của Dashboard.css
 * (width 320px right-panel, padding 22px/18px, panel-card padding 24px/22px,
 * border, shadow-sm...) nên width/padding/border tự động khớp 100% với
 * card cũ và các card khác (Tiến độ học tập, Thành tích). Chỉ phần bên
 * trong (calendar/textarea/button) là mới, được scope qua class riêng
 * trong ReminderCalendar.css để không đụng style .panel-card dùng chung.
 */
export default function ReminderCalendar() {
  const {
    selectedDate,
    setSelectedDate,
    content,
    setContent,
    isSubmitting,
    handleSubmit,
  } = useReminderCalendar();

  return (
    // Dùng lại đúng class "panel-card" + "panel-header" đang có trong
    // Dashboard.css để width/padding/border/shadow tự khớp với các card
    // khác trong RightPanel (Tiến độ học tập, Thành tích...) — không cần
    // định nghĩa width/height riêng.
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