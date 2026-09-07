import ReminderCalendar from "./ReminderCalendar/ReminderCalendar";
import StreakPanel from "./StreakPanel/StreakPanel";

export default function RightPanel() {
  return (
    <aside className="right-panel">
      {/* REMINDER */}
      <ReminderCalendar />

      {/* STREAK PANEL */}
      <StreakPanel />
    </aside>
  );
}