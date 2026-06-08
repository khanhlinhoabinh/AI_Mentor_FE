import api from "../configs/axios.config";

// UPLOAD file PDF/DOCX vào môn học
export const uploadDocument = async (subjectId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post(
    `/subjects/${subjectId}/documents`,
    formData
  );
  return response.data;
};

// LẤY DANH SÁCH tài liệu của môn học
export const getDocumentsBySubject = async (subjectId) => {
  const response = await api.get(
    `/subjects/${subjectId}/documents`
  );
  return response.data;
};

// XÓA tài liệu
export const deleteDocument = async (subjectId, documentId) => {
  const response = await api.delete(
    `/subjects/${subjectId}/documents/${documentId}`
  );
  return response.data;
};

// XEM tài liệu → cập nhật status SEEN
export const viewDocument = async (subjectId, documentId) => {
  const response = await api.patch(
    `/subjects/${subjectId}/documents/${documentId}/view`
  );
  return response.data;
};

// CHỈNH SỬA file Word → status EDITED
export const editDocument = async (subjectId, documentId, content) => {
  const response = await api.put(
    `/subjects/${subjectId}/documents/${documentId}/edit`,
    { content }
  );
  return response.data;
};

// ĐẾM số tài liệu của môn học
export const countDocuments = async (subjectId) => {
  const response = await api.get(
    `/subjects/${subjectId}/documents/count`
  );
  return response.data;
};

// Lấy URL để xem/tải file
export const getFileUrl = (subjectId, documentId) => {
  const token = localStorage.getItem("token");
  // Trả về URL có token để fetch
  return `http://localhost:8080/api/subjects/${subjectId}/documents/${documentId}/file`;
};

// Mở file trong tab mới
export const openFile = async (subjectId, documentId) => {
  const token = localStorage.getItem("token");
  const url = `http://localhost:8080/api/subjects/${subjectId}/documents/${documentId}/file`;

  // Fetch file với token rồi tạo blob URL để mở
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Cannot load file");

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, "_blank");
};