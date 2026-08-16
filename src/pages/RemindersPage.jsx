import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { CalendarClock, Inbox, LogIn } from "lucide-react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import ReminderCalendar from "../components/dashboard/ReminderCalendar/ReminderCalendar";
import ReminderListItem from "../components/reminders/ReminderListItem/ReminderListItem";
import { getMyReminders, deleteReminder } from "../services/reminder.services";
import { getDueDateStatus } from "../utils/dateUtils";
import "../styles/Dashboard.css"; // đảm bảo có :root vars + .panel-card dùng lại trong ReminderCalendar
import "../styles/RemindersPage.css";
import { toastError, toastSuccess, confirmDelete } from "../utils/swal";

const FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "upcoming", label: "Sắp tới" },
  { key: "overdue", label: "Quá hạn" },
];

export default function RemindersPage() {
  const isLoggedIn = !!localStorage.getItem("token");

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(isLoggedIn);
  const [deletingId, setDeletingId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (isLoggedIn) loadReminders();
  }, []);

  const loadReminders = async () => {
    setLoading(true);
    try {
      const data = await getMyReminders();
      const list = Array.isArray(data) ? data : (data?.content ?? []);
      const sorted = [...list].sort(
        (a, b) => new Date(a.reminderDate) - new Date(b.reminderDate),
      );
      setReminders(sorted);
    } catch (error) {
      console.error("Load reminders failed:", error);
      toastError("Không tải được danh sách lịch nhắc.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirmDelete(
      "Xóa lịch nhắc?",
      "Lịch nhắc này sẽ bị xóa vĩnh viễn.",
    );
    if (!ok) return;

    setDeletingId(id);
    try {
      await deleteReminder(id);
      setReminders((prev) => prev.filter((r) => r.id !== id));
      toastSuccess("Đã xóa lịch nhắc.");
    } catch (error) {
      console.error("Delete reminder failed:", error);
      toastError("Xóa lịch nhắc thất bại.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReminders = useMemo(() => {
    if (filter === "all") return reminders;
    return reminders.filter((r) => {
      const status = getDueDateStatus(r.reminderDate);
      if (filter === "overdue") return status === "overdue";
      if (filter === "upcoming") return status !== "overdue";
      return true;
    });
  }, [reminders, filter]);

  const overdueCount = reminders.filter(
    (r) => getDueDateStatus(r.reminderDate) === "overdue",
  ).length;

  return (
    <div className="app-layout">
      <Header />

      <div className="content-wrapper">
        <Sidebar />

        <main className="reminders-content">
          {!isLoggedIn ? (
            <div className="reminders-login-required">
              <LogIn size={36} />
              <h3>Đăng nhập để xem lịch nhắc nhở</h3>
              <p>Bạn cần đăng nhập để xem và tạo lịch nhắc của mình.</p>
              <button onClick={() => (window.location.href = "/login")}>
                Đăng nhập ngay
              </button>
            </div>
          ) : (
            <>
              <div className="reminders-page-header">
                <div className="reminders-page-title">
                  <CalendarClock size={22} />
                  <div>
                    <h2>Lịch nhắc nhở của tôi</h2>
                    <p>
                      {loading
                        ? "Đang tải..."
                        : `${reminders.length} lịch nhắc${
                            overdueCount > 0 ? ` · ${overdueCount} quá hạn` : ""
                          }`}
                    </p>
                  </div>
                </div>

                <div className="reminders-filter-tabs">
                  {FILTERS.map((f) => (
                    <button
                      key={f.key}
                      className={`reminders-filter-tab${
                        filter === f.key ? " active" : ""
                      }`}
                      onClick={() => setFilter(f.key)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="reminders-layout">
                <div className="reminders-list-col">
                  {loading ? (
                    <div className="reminders-loading">
                      Đang tải danh sách...
                    </div>
                  ) : filteredReminders.length === 0 ? (
                    <div className="reminders-empty">
                      <Inbox size={36} />
                      <p>Chưa có lịch nhắc nào.</p>
                      <span>Tạo lịch nhắc mới ở panel bên phải.</span>
                    </div>
                  ) : (
                    <div className="reminders-list">
                      {filteredReminders.map((r) => (
                        <ReminderListItem
                          key={r.id}
                          reminder={r}
                          onDelete={handleDelete}
                          deleting={deletingId === r.id}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="reminders-create-col">
                  <ReminderCalendar onCreated={loadReminders} />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
