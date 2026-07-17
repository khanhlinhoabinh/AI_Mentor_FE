import { useState } from "react";
import { Flame } from "lucide-react";
import "./CheckInButton.css";

export default function CheckInButton({ streak, checking, onCheckIn }) {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const done = streak?.checkedInToday === true;

  const handleClick = async () => {
    if (done || checking) return;
    try {
      const result = await onCheckIn();
      if (result) {
        const msg =
          result.currentStreak > 1
            ? `🔥 Chuỗi ${result.currentStreak} ngày! ${result.badgeIcon ?? ""}`
            : "✅ Điểm danh thành công!";
        setToastMsg(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch {}
  };

  return (
    <div className="ci-wrap">
      <button
        className={`ci-btn ${done ? "ci-btn--done" : ""} ${checking ? "ci-btn--loading" : ""}`}
        onClick={handleClick}
        disabled={done || checking}
        title={done ? "Đã điểm danh hôm nay" : "Điểm danh hôm nay"}
      >
        <Flame
          size={16}
          className={`ci-flame ${done ? "ci-flame--done" : "ci-flame--active"}`}
        />

        <span className="ci-text">
          {checking ? "..." : done ? "Đã điểm danh" : "Điểm danh"}
        </span>

        {streak?.currentStreak > 0 && (
          <span className={`ci-badge ${done ? "ci-badge--done" : ""}`}>
            {streak.currentStreak}
          </span>
        )}
      </button>

      {/* Toast popup */}
      {showToast && <div className="ci-toast">{toastMsg}</div>}
    </div>
  );
}
