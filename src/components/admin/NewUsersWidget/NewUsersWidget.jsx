import { useEffect, useState, useCallback } from "react";
import styles from "./NewUsersWidget.module.css";
import { getNewUsers } from "../../../services/admin.services";

const FILTERS = [
  { label: "Hôm nay", value: 1 },
  { label: "7 ngày", value: 7 },
];

const initialsOf = (name = "") =>
  name.split(" ").filter(Boolean).slice(-2).map((w) => w[0]).join("").toUpperCase();

/**
 * Widget "New Users" — GET /api/admin/users/new?days=1|7
 */
export default function NewUsersWidget() {
  const [days, setDays] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (selectedDays) => {
    setLoading(true);
    try {
      const data = await getNewUsers(selectedDays);
      setUsers(data || []);
    } catch (err) {
      console.error("Không thể tải danh sách người dùng mới:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(days); }, [days, load]);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Người dùng mới</h3>
        <div className={styles.filterGroup}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`${styles.filterBtn} ${days === f.value ? styles.filterActive : ""}`}
              onClick={() => setDays(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {loading && <p className={styles.hint}>Đang tải...</p>}
        {!loading && users.length === 0 && <p className={styles.hint}>Không có người dùng mới</p>}
        {!loading && users.map((u) => (
          <div key={u.userId} className={styles.item}>
            <div className={styles.avatar}>{initialsOf(u.fullName)}</div>
            <div className={styles.info}>
              <p className={styles.name}>{u.fullName}</p>
              <p className={styles.email}>{u.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
