import { Trash2, Clock } from "lucide-react";
import "./ReminderListItem.css";
import { formatDate, getDueDateStatus, getDaysUntilText } from "../../../utils/dateUtils";

/**
 * ReminderListItem
 * 1 dòng trong danh sách lịch nhắc: ô ngày lớn bên trái + nội dung +
 * badge đếm ngược màu theo trạng thái (quá hạn/sắp tới/bình thường) + nút xoá.
 */
export default function ReminderListItem({ reminder, onDelete, deleting }) {
  const status = getDueDateStatus(reminder.reminderDate);
  const daysText = getDaysUntilText(reminder.reminderDate);

  const dateObj = new Date(reminder.reminderDate);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;

  return (
    <div className={`reminder-item reminder-item--${status}`}>
      <div className="reminder-item__date">
        <span className="reminder-item__day">{day}</span>
        <span className="reminder-item__month">Thg {month}</span>
      </div>

      <div className="reminder-item__body">
        <h4 className="reminder-item__title">{reminder.title}</h4>
        {reminder.description && (
          <p className="reminder-item__desc">{reminder.description}</p>
        )}
        <div className="reminder-item__meta">
          <Clock size={13} />
          <span>{formatDate(reminder.reminderDate)}</span>
          <span className={`reminder-item__badge reminder-item__badge--${status}`}>
            {daysText}
          </span>
        </div>
      </div>

      <button
        className="reminder-item__delete"
        onClick={() => onDelete(reminder.id)}
        disabled={deleting}
        title="Xoá lịch nhắc"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}