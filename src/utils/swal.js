import Swal from "sweetalert2";

/* ── Màu chủ đạo dự án ── */
const PRIMARY = "#22c55e";
const DANGER = "#ef4444";
const WARNING = "#f59e0b";
const INFO = "#3b82f6";
const DARK = "#1e293b";

/* ────────────────────────────────────
   TOAST nhỏ góc trên phải (thay thế
   react-toastify & dt-toast inline)
──────────────────────────────────── */
const Toast = Swal.mixin({
  toast: true,
  position: "top-right",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (el) => {
    el.addEventListener("mouseenter", Swal.stopTimer);
    el.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const toastSuccess = (msg) =>
  Toast.fire({ icon: "success", title: msg });

export const toastError = (msg) => Toast.fire({ icon: "error", title: msg });

export const toastWarning = (msg) =>
  Toast.fire({ icon: "warning", title: msg });

export const toastInfo = (msg) => Toast.fire({ icon: "info", title: msg });

/* ────────────────────────────────────
   CONFIRM dialog (thay window.confirm)
──────────────────────────────────── */
export const confirmDelete = async (title, text) => {
  const result = await Swal.fire({
    title: title ?? "Xác nhận xóa",
    text: text ?? "Hành động này không thể hoàn tác.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: DANGER,
    cancelButtonColor: "#e2e8f0",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
    reverseButtons: true,
    customClass: { cancelButton: "swal-cancel-dark" },
  });
  return result.isConfirmed;
};

export const confirmAction = async (title, text, confirmText = "Xác nhận") => {
  const result = await Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: PRIMARY,
    cancelButtonColor: "#e2e8f0",
    confirmButtonText: confirmText,
    cancelButtonText: "Hủy",
    reverseButtons: true,
    customClass: { cancelButton: "swal-cancel-dark" },
  });
  return result.isConfirmed;
};

/* ────────────────────────────────────
   ALERT đơn giản (thay window.alert)
──────────────────────────────────── */
export const alertSuccess = (title, text) =>
  Swal.fire({ icon: "success", title, text, confirmButtonColor: PRIMARY });

export const alertError = (title, text) =>
  Swal.fire({ icon: "error", title, text, confirmButtonColor: DANGER });

export const alertWarning = (title, text) =>
  Swal.fire({ icon: "warning", title, text, confirmButtonColor: WARNING });

export const alertInfo = (title, text) =>
  Swal.fire({ icon: "info", title, text, confirmButtonColor: INFO });
