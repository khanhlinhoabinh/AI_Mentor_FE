import { useState, useEffect, useCallback } from "react";
import { getStreak, checkIn } from "../services/streak.services";

export function useStreak() {
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const load = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await getStreak();
      setStreak(data);
    } catch {
      // user chưa có streak record → bình thường
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Tự động mở lại nút khi sang ngày mới (đợi đến 00:00)
  useEffect(() => {
    if (!streak?.checkedInToday) return;

    const now = new Date();
    const tmr = new Date();
    tmr.setHours(24, 0, 0, 0); // 00:00 ngày mai
    const msLeft = tmr - now;

    const timer = setTimeout(() => {
      // Sang ngày mới → reload streak để mở lại nút
      load();
    }, msLeft);

    return () => clearTimeout(timer);
  }, [streak?.checkedInToday, load]);

  const handleCheckIn = async () => {
    if (checking || streak?.checkedInToday) return;
    setChecking(true);
    try {
      const data = await checkIn();
      setStreak(data);
      return data;
    } finally {
      setChecking(false);
    }
  };

  return { streak, loading, checking, handleCheckIn, reload: load };
}
