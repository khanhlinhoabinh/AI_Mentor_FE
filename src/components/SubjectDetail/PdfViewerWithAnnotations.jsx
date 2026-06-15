import { useEffect, useRef, useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { getAnnotations, saveAnnotations } from "../../services/document.services";
import "./PdfViewerWithAnnotations.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const COLORS = [
  { label: "Vàng",        value: "#ffe066" },
  { label: "Xanh lá",    value: "#b8f5b8" },
  { label: "Hồng",       value: "#ffb3c6" },
  { label: "Xanh dương", value: "#b3d9ff" },
];

function useDebouncedCallback(fn, delay) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

export default function PdfViewerWithAnnotations({ subjectId, documentId, fileUrl }) {
  const [blobUrl,    setBlobUrl]    = useState(null);
  const [numPages,   setNumPages]   = useState(0);
  const [highlights, setHighlights] = useState([]);
  const [loadingAnnotations, setLoadingAnnotations] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");
  const [selectedColor, setSelectedColor] = useState("#ffe066");
  const [notePopup, setNotePopup]   = useState(null); // { highlightId, x, y }
  const [noteText,  setNoteText]    = useState("");
  // ✅ Chế độ: "highlight" hoặc "note"
  const [mode, setMode] = useState("highlight");

  // ── Fetch file với JWT ──
  useEffect(() => {
    let url;
    const fetchBlob = async () => {
      try {
        const token = localStorage.getItem("token");
        const res   = await fetch(fileUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(res.status);
        const blob = await res.blob();
        url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (e) {
        console.error("Lỗi tải PDF:", e);
      }
    };
    fetchBlob();
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [fileUrl]);

  // ── Load annotations ──
  useEffect(() => {
    const load = async () => {
      try {
        const data   = await getAnnotations(subjectId, documentId);
        const parsed = JSON.parse(data.annotationsJson || "[]");
        setHighlights(parsed);
      } catch (e) {
        console.error("Lỗi tải annotation:", e);
      } finally {
        setLoadingAnnotations(false);
      }
    };
    load();
  }, [subjectId, documentId]);

  // ── Auto save ──
  const autoSave = useDebouncedCallback(async (list) => {
    setSaveStatus("Đang lưu...");
    try {
      await saveAnnotations(subjectId, documentId, JSON.stringify(list));
      setSaveStatus("Đã lưu ✓");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch {
      setSaveStatus("Lỗi lưu ✗");
    }
  }, 1000);

  const updateHighlights = useCallback((list) => {
    setHighlights(list);
    autoSave(list);
  }, [autoSave]);

  // ── Bôi chọn text → thêm highlight ──
  const handleMouseUp = (pageNumber, e) => {
    if (notePopup) return;
    if (mode !== "highlight") return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const rects = Array.from(range.getClientRects());
    if (!rects.length) return;

    const pageEl = document.getElementById(`pdf-page-${pageNumber}`);
    if (!pageEl) return;
    const pageRect = pageEl.getBoundingClientRect();

    const relativeRects = rects.map((r) => ({
      left:   r.left   - pageRect.left,
      top:    r.top    - pageRect.top,
      width:  r.width,
      height: r.height,
    }));

    const newHighlight = {
      id:    Math.random().toString(36).substr(2, 9),
      page:  pageNumber,
      rects: relativeRects,
      color: selectedColor,
      text:  selection.toString(),
      note:  "",
    };

    setHighlights(prev => {
      const list = [...prev, newHighlight];
      autoSave(list);
      return list;
    });
    selection.removeAllRanges();
  };

  // ── Click vào highlight rect ──
  // Dùng onMouseDown thay onClick để bắt trước text layer
  const handleHighlightMouseDown = (e, highlight) => {
    e.stopPropagation();
    e.preventDefault();
    setNoteText(highlight.note || "");
    setNotePopup({ highlightId: highlight.id, x: e.clientX, y: e.clientY });
  };

  const closePopup = () => { setNotePopup(null); setNoteText(""); };

  const saveNote = () => {
    const updated = highlights.map((h) =>
      h.id === notePopup.highlightId ? { ...h, note: noteText } : h
    );
    updateHighlights(updated);
    closePopup();
  };

  const deleteHighlight = (id) => {
    updateHighlights(highlights.filter((h) => h.id !== id));
    closePopup();
  };

  // Click ngoài popup → đóng
  useEffect(() => {
    if (!notePopup) return;
    const handler = (e) => {
      if (!e.target.closest(".note-popup")) closePopup();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notePopup]);

  if (!blobUrl || loadingAnnotations) {
    return <div className="pdf-loading">Đang tải tài liệu...</div>;
  }

  return (
    <div className="pdf-viewer-wrap">

      {/* ── Toolbar ── */}
      <div className="pdf-status-bar">
        <div className="pdf-toolbar-left">
          {/* Toggle mode */}
          <div className="pdf-mode-btns">
            <button
              className={`mode-btn ${mode === "highlight" ? "active" : ""}`}
              onClick={() => setMode("highlight")}
              title="Bôi đen để highlight"
            >
              🖊 Highlight
            </button>
            <button
              className={`mode-btn ${mode === "manage" ? "active" : ""}`}
              onClick={() => setMode("manage")}
              title="Click vào highlight để ghi chú / xóa"
            >
              💬 Quản lý
            </button>
          </div>

          {/* Màu — chỉ hiện khi highlight mode */}
          {mode === "highlight" && (
            <div className="pdf-color-picker">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  className={`color-btn ${selectedColor === c.value ? "active" : ""}`}
                  style={{ background: c.value }}
                  title={c.label}
                  onClick={() => setSelectedColor(c.value)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="pdf-right-bar">
          <span className="pdf-hint-small">
            {mode === "highlight"
              ? "Bôi chọn văn bản để highlight"
              : "Click vào highlight để ghi chú hoặc xóa"}
          </span>
          {saveStatus && (
            <span className={`pdf-save-status ${saveStatus.includes("✓") ? "saved" : ""}`}>
              {saveStatus}
            </span>
          )}
        </div>
      </div>

      {/* ── PDF pages ── */}
      <div className="pdf-scroll-area">
        <Document
          file={blobUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from({ length: numPages }, (_, i) => {
            const pageNum = i + 1;
            const pageHighlights = highlights.filter((h) => h.page === pageNum);

            return (
              <div
                key={pageNum}
                id={`pdf-page-${pageNum}`}
                className="pdf-page-wrap"
                onMouseUp={(e) => handleMouseUp(pageNum, e)}
              >
                <Page pageNumber={pageNum} width={780} />

                {/* ✅ Highlight overlay — z-index cao hơn text layer khi ở manage mode */}
                <div className={`pdf-highlight-layer ${mode === "manage" ? "manage-mode" : ""}`}>
                  {pageHighlights.map((h) =>
                    h.rects.map((r, ri) => (
                      <div
                        key={`${h.id}-${ri}`}
                        className={`pdf-highlight-rect ${h.note ? "has-note" : ""}`}
                        style={{
                          left:       r.left,
                          top:        r.top,
                          width:      r.width,
                          height:     r.height,
                          background: h.color,
                          // ✅ Chỉ bắt sự kiện khi ở manage mode
                          pointerEvents: mode === "manage" ? "all" : "none",
                          cursor: mode === "manage" ? "pointer" : "default",
                        }}
                        onMouseDown={(e) =>
                          mode === "manage" && handleHighlightMouseDown(e, h)
                        }
                      >
                        {ri === 0 && h.note && (
                          <span className="note-dot">💬</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </Document>
      </div>

      {/* ── Note popup ── */}
      {notePopup && (
        <div
          className="note-popup"
          style={{
            top:  Math.min(notePopup.y, window.innerHeight - 280),
            left: Math.min(notePopup.x, window.innerWidth  - 300),
          }}
        >
          <div className="note-popup-header">
            <span>📝 Ghi chú</span>
            <button className="note-popup-close" onClick={closePopup}>✕</button>
          </div>
          <textarea
            className="note-popup-textarea"
            placeholder="Nhập ghi chú của bạn..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            autoFocus
            rows={4}
          />
          <div className="note-popup-actions">
            <button
              className="note-btn delete"
              onClick={() => deleteHighlight(notePopup.highlightId)}
            >
              🗑 Xóa highlight
            </button>
            <button className="note-btn save" onClick={saveNote}>
              💾 Lưu ghi chú
            </button>
          </div>
        </div>
      )}
    </div>
  );
}