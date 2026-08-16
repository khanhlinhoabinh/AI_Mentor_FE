import { useEffect, useRef, useState, useCallback } from "react";
import {
  X,
  Download,
  Save,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image as ImageIcon,
  Table,
  Link,
  Minus,
  Quote,
  Undo2,
  Redo2,
  Search,
  CheckCircle2,
  Circle,
  Type,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  convertInchesToTwip,
} from "docx";
import { saveAs } from "file-saver";
import { editDocument } from "../../services/document.services";
import "./DocxEditor.css";
import { confirmDelete, confirmAction, toastError } from "../../utils/swal";

/* ══════ Constants ══════ */
const FONTS = [
  "Calibri",
  "Times New Roman",
  "Arial",
  "Verdana",
  "Georgia",
  "Courier New",
  "Tahoma",
  "Trebuchet MS",
];
const FSIZES = [
  8, 9, 10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 28, 32, 36, 48, 72,
];
const RIBBON_TABS = ["Trang chủ", "Chèn", "Bố cục", "Xem"];

// A4: height 1122px, padding top+bottom = 96*2 = 192px → content area = 930px
const MAX_CONTENT_HEIGHT = 900;

/* ══════ Helpers ══════ */
const isCmd = (e) => e.ctrlKey || e.metaKey;

function ColorBtn({ icon, title, defaultColor, onApply }) {
  const inputRef = useRef();
  const [color, setColor] = useState(defaultColor);
  return (
    <div
      className="de-color-wrap"
      title={title}
      onClick={() => inputRef.current?.click()}
    >
      <div className="de-color-preview">
        <span style={{ fontSize: 11, fontWeight: 700, lineHeight: 1 }}>
          {icon}
        </span>
        <div className="de-color-bar" style={{ background: color }} />
      </div>
      <input
        ref={inputRef}
        type="color"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
          onApply(e.target.value);
        }}
      />
    </div>
  );
}

/* ══════ Main Component ══════ */
export default function DocxEditor({ doc, subjectId, onClose, onSaved }) {
  const imgInputRef = useRef(null);

  const [activeRibbon, setActiveRibbon] = useState("Trang chủ");
  const [saving, setSaving] = useState(false);
  const [modified, setModified] = useState(false);
  const [saved, setSaved] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showFind, setShowFind] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [replaceCount, setReplaceCount] = useState(null);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [tableHover, setTableHover] = useState({ r: 0, c: 0 });
  const [zoom, setZoom] = useState(100);
  const [currentFont, setCurrentFont] = useState("Calibri");
  const [currentSize, setCurrentSize] = useState(14);

  // ── Phân trang: mảng HTML mỗi trang ──
  const [pages, setPages] = useState([""]);
  const [currentPage, setCurrentPage] = useState(0); // trang đang active (0-based)
  const pageRefs = useRef([]); // ref[i] = contenteditable div của trang i

  if (!doc || !doc.fileName) return null;

  /* ── Đếm từ / ký tự (gom tất cả trang) ── */
  const countStats = useCallback(() => {
    const text = pageRefs.current
      .filter(Boolean)
      .map((el) => el.innerText ?? "")
      .join(" ");
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    setCharCount(text.replace(/\s/g, "").length);
  }, []);

  /* ── Khởi tạo nội dung ── */
  useEffect(() => {
    const stored = doc.extractedText ?? "";

    // Tách theo page-break marker nếu đã từng lưu nhiều trang
    const PAGE_BREAK = "<!--PAGE_BREAK-->";
    let pageContents;
    if (stored.includes(PAGE_BREAK)) {
      pageContents = stored.split(PAGE_BREAK);
    } else {
      const html = stored.trim().startsWith("<")
        ? stored
        : stored
            .split("\n")
            .map((l) => `<p>${l || "<br>"}</p>`)
            .join("");
      pageContents = [html || "<p><br></p>"];
    }

    setPages(pageContents);
    setCurrentPage(0);

    // Render vào DOM sau khi state cập nhật
    setTimeout(() => {
      pageContents.forEach((html, i) => {
        const el = pageRefs.current[i];
        if (el) el.innerHTML = html;
      });
      pageRefs.current[0]?.focus();
      countStats();
    }, 80);
  }, [doc]);

  /* ── Sync DOM → pages state khi input ── */
  const handlePageInput = useCallback((pageIdx) => {
    setModified(true);
    setSaved(false);
    countStats();

    const el = pageRefs.current[pageIdx];
    if (!el) return;

    // Nội dung trang hiện tại vượt quá MAX_CONTENT_HEIGHT → split
    if (el.scrollHeight > MAX_CONTENT_HEIGHT) {
      splitPageAt(pageIdx);
    }
  }, []);

  /* ── Split trang khi nội dung tràn ── */
  const splitPageAt = useCallback((pageIdx) => {
    const el = pageRefs.current[pageIdx];
    if (!el) return;

    const children = Array.from(el.children);
    if (children.length < 2) return; // không đủ node để split

    // Tìm điểm split: node nào khiến tổng height vượt ngưỡng
    let accumulated = 0;
    let splitIdx = children.length - 1;

    for (let i = 0; i < children.length; i++) {
      accumulated += children[i].offsetHeight + 4; // +4 = margin estimate
      if (accumulated > MAX_CONTENT_HEIGHT) {
        splitIdx = i;
        break;
      }
    }

    // Tách nội dung thừa
    const overflowHtml = children
      .slice(splitIdx)
      .map((n) => n.outerHTML)
      .join("");

    // Xóa khỏi trang hiện tại
    children.slice(splitIdx).forEach((n) => n.remove());
    const currentHtml = el.innerHTML;

    setPages((prev) => {
      const next = [...prev];
      next[pageIdx] = currentHtml;
      if (pageIdx + 1 < next.length) {
        // Prepend vào trang kế
        next[pageIdx + 1] = overflowHtml + next[pageIdx + 1];
      } else {
        // Tạo trang mới
        next.push(overflowHtml);
      }
      return next;
    });

    // Render trang kế và di chuyển cursor
    setTimeout(() => {
      const nextEl = pageRefs.current[pageIdx + 1];
      if (nextEl) {
        const html =
          overflowHtml + (pageRefs.current[pageIdx + 1]?.innerHTML || "");
        nextEl.innerHTML = html;
        nextEl.focus();
        // Đặt cursor ở đầu trang kế
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(nextEl, 0);
        range.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(range);
        setCurrentPage(pageIdx + 1);
      }
    }, 50);
  }, []);

  /* ── Xử lý Backspace ở đầu trang → merge với trang trước ── */
  const handlePageKeyDown = useCallback(
    (e, pageIdx) => {
      // Keyboard shortcuts chung
      if (isCmd(e) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if (isCmd(e) && e.key === "f") {
        e.preventDefault();
        setShowFind((v) => !v);
      }
      if (isCmd(e) && e.key === "z") {
        e.preventDefault();
        exec("undo");
      }
      if (isCmd(e) && e.key === "y") {
        e.preventDefault();
        exec("redo");
      }

      // Backspace ở đầu trang → merge với trang trước
      if (e.key === "Backspace" && pageIdx > 0) {
        const sel = window.getSelection();
        const el = pageRefs.current[pageIdx];
        if (!sel || !el) return;

        const range = sel.getRangeAt(0);
        // Cursor ở vị trí đầu tiên của trang
        const atStart =
          range.startOffset === 0 &&
          (range.startContainer === el ||
            range.startContainer === el.firstChild);

        if (atStart) {
          e.preventDefault();
          mergeWithPrevPage(pageIdx);
        }
      }

      // Enter ở cuối trang cuối → thêm trang mới nếu gần đầy
      if (e.key === "Enter" && pageIdx === pages.length - 1) {
        const el = pageRefs.current[pageIdx];
        if (el && el.scrollHeight > MAX_CONTENT_HEIGHT * 0.9) {
          e.preventDefault();
          addNewPage(pageIdx);
        }
      }
    },
    [pages.length],
  );

  const mergeWithPrevPage = useCallback((pageIdx) => {
    const prevEl = pageRefs.current[pageIdx - 1];
    const currEl = pageRefs.current[pageIdx];
    if (!prevEl || !currEl) return;

    const mergedHtml = prevEl.innerHTML + currEl.innerHTML;
    prevEl.innerHTML = mergedHtml;

    setPages((prev) => {
      const next = [...prev];
      next[pageIdx - 1] = mergedHtml;
      next.splice(pageIdx, 1);
      return next;
    });

    // Focus vào cuối trang trước
    setTimeout(() => {
      prevEl.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(prevEl);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
      setCurrentPage(pageIdx - 1);
    }, 50);
  }, []);

  const addNewPage = useCallback((afterIdx) => {
    setPages((prev) => {
      const next = [...prev];
      next.splice(afterIdx + 1, 0, "<p><br></p>");
      return next;
    });
    setTimeout(() => {
      const newEl = pageRefs.current[afterIdx + 1];
      if (newEl) {
        newEl.innerHTML = "<p><br></p>";
        newEl.focus();
        setCurrentPage(afterIdx + 1);
      }
    }, 50);
  }, []);

  /* ── execCommand wrapper ── */
  const exec = (cmd, val = null) => {
    // Focus trang hiện tại
    pageRefs.current[currentPage]?.focus();
    document.execCommand(cmd, false, val);
  };
  const active = (cmd) => {
    try {
      return document.queryCommandState(cmd);
    } catch {
      return false;
    }
  };

  /* ── Find & Replace (áp dụng lên tất cả trang) ── */
  const handleFind = () => {
    if (!findText) return;
    const regex = new RegExp(
      findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "gi",
    );
    pageRefs.current.filter(Boolean).forEach((el) => {
      el.innerHTML = el.innerHTML
        .replace(/<mark[^>]*>(.*?)<\/mark>/gi, "$1")
        .replace(regex, (m) => `<mark>${m}</mark>`);
    });
  };

  const handleReplace = () => {
    if (!findText) return;
    const regex = new RegExp(
      findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "gi",
    );
    let total = 0;
    pageRefs.current.filter(Boolean).forEach((el) => {
      const before = el.innerHTML.replace(/<mark[^>]*>(.*?)<\/mark>/gi, "$1");
      total += (before.match(regex) || []).length;
      el.innerHTML = before.replace(regex, replaceText);
    });
    setReplaceCount(total);
    setTimeout(() => setReplaceCount(null), 2500);
    setModified(true);
  };

  /* ── Insert table ── */
  const insertTable = (rows, cols) => {
    let html = `<table><tbody>`;
    for (let r = 0; r < rows; r++) {
      html += "<tr>";
      for (let c = 0; c < cols; c++) {
        const tag = r === 0 ? "th" : "td";
        html += `<${tag}>&nbsp;</${tag}>`;
      }
      html += "</tr>";
    }
    html += "</tbody></table><p><br></p>";
    exec("insertHTML", html);
    setShowTablePicker(false);
  };

  /* ── Insert image ── */
  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      exec(
        "insertHTML",
        `<img src="${ev.target.result}" style="max-width:100%;display:block;margin:8px 0;" />`,
      );
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  /* ── Insert link ── */
  const insertLink = () => {
    const url = window.prompt("Nhập URL:", "https://");
    if (url) exec("createLink", url);
  };

  /* ── Lưu lên BE ── */
  const handleSave = async () => {
    setSaving(true);
    try {
      // Sync DOM → state trước khi lưu
      const allHtml = pageRefs.current
        .filter(Boolean)
        .map((el) => el.innerHTML)
        .join("<!--PAGE_BREAK-->");

      const updated = await editDocument(subjectId, doc.documentId, allHtml);
      onSaved?.(updated);
      setModified(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toastError("Lưu thất bại!");
    } finally {
      setSaving(false);
    }
  };

  /* ── Tải về DOCX ── */
  const handleDownload = async () => {
    const children = [];

    pageRefs.current.filter(Boolean).forEach((pageEl, pi) => {
      if (pi > 0) {
        // Page break giữa các trang
        children.push(
          new Paragraph({
            children: [],
            pageBreakBefore: true,
          }),
        );
      }

      const nodes = pageEl.querySelectorAll(
        "p,h1,h2,h3,h4,h5,h6,blockquote,pre,li",
      );
      const makeAlignment = (el) => {
        const align = el.style?.textAlign ?? "";
        if (align === "center") return AlignmentType.CENTER;
        if (align === "right") return AlignmentType.RIGHT;
        if (align === "justify") return AlignmentType.JUSTIFIED;
        return AlignmentType.LEFT;
      };

      const parseRuns = (el) => {
        const runs = [];
        const walk = (node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (!text) return;
            let bold = false,
              italics = false,
              underline = false,
              strike = false,
              color = "000000";
            let cur = node.parentElement;
            while (cur && cur !== el) {
              const tag = cur.tagName?.toLowerCase();
              const s = cur.style ?? {};
              if (tag === "b" || tag === "strong" || s.fontWeight === "bold")
                bold = true;
              if (tag === "i" || tag === "em" || s.fontStyle === "italic")
                italics = true;
              if (tag === "u" || s.textDecoration?.includes("underline"))
                underline = true;
              if (tag === "s" || tag === "strike") strike = true;
              if (s.color) {
                const hex = s.color.match(/\d+/g);
                if (hex?.length >= 3)
                  color = hex
                    .slice(0, 3)
                    .map((n) => parseInt(n).toString(16).padStart(2, "0"))
                    .join("");
              }
              cur = cur.parentElement;
            }
            runs.push(
              new TextRun({
                text,
                bold,
                italics,
                strike,
                color,
                underline: underline ? { type: "single" } : undefined,
                size: currentSize * 2,
                font: currentFont,
              }),
            );
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach(walk);
          }
        };
        el.childNodes.forEach(walk);
        return runs.length
          ? runs
          : [
              new TextRun({
                text: el.innerText || "",
                size: currentSize * 2,
                font: currentFont,
              }),
            ];
      };

      nodes.forEach((el) => {
        const tag = el.tagName.toLowerCase();
        const runs = parseRuns(el);
        if (!runs.length) return;
        if (tag === "h1")
          children.push(
            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              children: runs,
              alignment: makeAlignment(el),
            }),
          );
        else if (tag === "h2")
          children.push(
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: runs,
              alignment: makeAlignment(el),
            }),
          );
        else if (tag === "h3")
          children.push(
            new Paragraph({
              heading: HeadingLevel.HEADING_3,
              children: runs,
              alignment: makeAlignment(el),
            }),
          );
        else
          children.push(
            new Paragraph({
              children: runs,
              alignment: makeAlignment(el),
              spacing: { after: 80 },
            }),
          );
      });
    });

    if (!children.length)
      children.push(new Paragraph({ children: [new TextRun("")] }));

    const docxFile = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 },
            },
          },
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(docxFile);
    saveAs(blob, `${doc.fileName.replace(/\.[^/.]+$/, "")}_edited.docx`);
  };

  /* ── Đóng ── */
  const handleClose = () => {
    const ok2 = confirmAction(
      "Thoát không lưu?",
      "Có thay đổi chưa được lưu. Bạn có muốn thoát không?",
      "Thoát",
    );
    if (!ok2) return;
    onClose();
  };

  /* ── Toolbar renderer ── */
  const renderToolbar = () => {
    if (activeRibbon === "Trang chủ")
      return (
        <>
          <select
            className="de-select"
            style={{ width: 110 }}
            value={currentFont}
            onChange={(e) => {
              setCurrentFont(e.target.value);
              exec("fontName", e.target.value);
            }}
          >
            {FONTS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <select
            className="de-select"
            style={{ width: 52 }}
            value={currentSize}
            onChange={(e) => {
              const pt = Number(e.target.value);
              setCurrentSize(pt);
              const sel = window.getSelection();
              if (sel && sel.rangeCount) {
                const span = document.createElement("span");
                span.style.fontSize = pt + "px";
                try {
                  sel.getRangeAt(0).surroundContents(span);
                } catch {
                  exec("fontSize", 4);
                }
              }
            }}
          >
            {FSIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="de-toolbar-sep" />

          <div className="de-toolbar-group">
            {[
              ["bold", <Bold size={13} />, "Đậm (Ctrl+B)"],
              ["italic", <Italic size={13} />, "Nghiêng (Ctrl+I)"],
              ["underline", <Underline size={13} />, "Gạch dưới (Ctrl+U)"],
              ["strikeThrough", <Strikethrough size={13} />, "Gạch ngang"],
              ["subscript", <Subscript size={13} />, "Chỉ số dưới"],
              ["superscript", <Superscript size={13} />, "Chỉ số trên"],
            ].map(([cmd, icon, tip]) => (
              <button
                key={cmd}
                className={`de-tool-btn ${active(cmd) ? "active" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  exec(cmd);
                }}
                title={tip}
              >
                {icon}
              </button>
            ))}
          </div>

          <div className="de-toolbar-sep" />
          <ColorBtn
            icon="A"
            title="Màu chữ"
            defaultColor="#111827"
            onApply={(c) => exec("foreColor", c)}
          />
          <ColorBtn
            icon="▌"
            title="Màu nền chữ"
            defaultColor="#ffff00"
            onApply={(c) => exec("hiliteColor", c)}
          />
          <div className="de-toolbar-sep" />

          <select
            className="de-select"
            style={{ width: 102 }}
            defaultValue=""
            onChange={(e) => {
              exec("formatBlock", e.target.value || "p");
              e.target.value = "";
            }}
          >
            <option value="">Đoạn văn</option>
            <option value="h1">Tiêu đề 1</option>
            <option value="h2">Tiêu đề 2</option>
            <option value="h3">Tiêu đề 3</option>
            <option value="h4">Tiêu đề 4</option>
            <option value="blockquote">Trích dẫn</option>
            <option value="pre">Code block</option>
          </select>

          <div className="de-toolbar-sep" />

          <div className="de-toolbar-group">
            {[
              ["justifyLeft", <AlignLeft size={13} />, "Căn trái"],
              ["justifyCenter", <AlignCenter size={13} />, "Căn giữa"],
              ["justifyRight", <AlignRight size={13} />, "Căn phải"],
              ["justifyFull", <AlignJustify size={13} />, "Căn đều"],
            ].map(([cmd, icon, tip]) => (
              <button
                key={cmd}
                className={`de-tool-btn ${active(cmd) ? "active" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  exec(cmd);
                }}
                title={tip}
              >
                {icon}
              </button>
            ))}
          </div>

          <div className="de-toolbar-sep" />

          <div className="de-toolbar-group">
            <button
              className="de-tool-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("insertUnorderedList");
              }}
              title="Danh sách bullet"
            >
              <List size={13} />
            </button>
            <button
              className="de-tool-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("insertOrderedList");
              }}
              title="Danh sách số"
            >
              <ListOrdered size={13} />
            </button>
            <button
              className="de-tool-btn de-tool-btn-wide"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("indent");
              }}
              title="Tăng thụt lề"
            >
              →
            </button>
            <button
              className="de-tool-btn de-tool-btn-wide"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("outdent");
              }}
              title="Giảm thụt lề"
            >
              ←
            </button>
          </div>

          <div className="de-toolbar-sep" />

          <div className="de-toolbar-group">
            <button
              className="de-tool-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("undo");
              }}
              title="Hoàn tác (Ctrl+Z)"
            >
              <Undo2 size={13} />
            </button>
            <button
              className="de-tool-btn"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("redo");
              }}
              title="Làm lại (Ctrl+Y)"
            >
              <Redo2 size={13} />
            </button>
          </div>

          <div className="de-toolbar-sep" />

          <button
            className="de-tool-btn"
            onClick={() => setShowFind((v) => !v)}
            title="Tìm & Thay thế (Ctrl+F)"
          >
            <Search size={13} />
          </button>
        </>
      );

    if (activeRibbon === "Chèn")
      return (
        <>
          <div className="de-table-picker-wrap">
            <button
              className="de-tool-btn"
              title="Chèn bảng"
              onClick={() => setShowTablePicker((v) => !v)}
            >
              <Table size={13} />
            </button>
            {showTablePicker && (
              <div className="de-table-picker">
                <div className="de-table-grid">
                  {Array.from({ length: 8 }, (_, r) =>
                    Array.from({ length: 8 }, (_, c) => (
                      <div
                        key={`${r}-${c}`}
                        className={`de-table-cell ${r <= tableHover.r && c <= tableHover.c ? "hover" : ""}`}
                        onMouseEnter={() => setTableHover({ r, c })}
                        onClick={() => insertTable(r + 1, c + 1)}
                      />
                    )),
                  )}
                </div>
                <div className="de-table-hint">
                  {tableHover.r + 1} × {tableHover.c + 1} bảng
                </div>
              </div>
            )}
          </div>

          <button
            className="de-tool-btn"
            title="Chèn ảnh"
            onClick={() => imgInputRef.current?.click()}
          >
            <ImageIcon size={13} />
          </button>
          <button
            className="de-tool-btn"
            title="Chèn liên kết"
            onClick={insertLink}
          >
            <Link size={13} />
          </button>
          <button
            className="de-tool-btn"
            title="Đường kẻ ngang"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("insertHorizontalRule");
            }}
          >
            <Minus size={13} />
          </button>
          <button
            className="de-tool-btn"
            title="Trích dẫn"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("formatBlock", "blockquote");
            }}
          >
            <Quote size={13} />
          </button>
          <button
            className="de-tool-btn de-tool-btn-wide"
            title="Xóa định dạng"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("removeFormat");
            }}
          >
            <Type size={13} />
          </button>

          <div className="de-toolbar-sep" />

          {/* Thêm trang thủ công */}
          <button
            className="de-tool-btn de-tool-btn-wide"
            onClick={() => addNewPage(currentPage)}
            title="Thêm trang mới"
          >
            + Trang
          </button>
        </>
      );

    if (activeRibbon === "Bố cục")
      return (
        <>
          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>
            Zoom:
          </span>
          <select
            className="de-select"
            style={{ width: 68 }}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          >
            {[50, 75, 90, 100, 110, 125, 150, 175, 200].map((z) => (
              <option key={z} value={z}>
                {z}%
              </option>
            ))}
          </select>
          <div className="de-toolbar-sep" />
          <button
            className="de-tool-btn de-tool-btn-wide"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("removeFormat");
            }}
            title="Xóa toàn bộ định dạng vùng chọn"
          >
            Xóa định dạng
          </button>
          <div className="de-toolbar-sep" />
          {/* Xóa trang hiện tại */}
          {pages.length > 1 && (
            <button
              className="de-tool-btn de-tool-btn-wide de-danger"
              onClick={() => {
                const ok3 = confirmDelete(`Xóa trang ${currentPage + 1}?`);
                if (!ok3) return;
                setPages((prev) => {
                  const next = [...prev];
                  next.splice(currentPage, 1);
                  return next;
                });
                setCurrentPage((p) => Math.max(0, p - 1));
              }}
            >
              🗑 Xóa trang
            </button>
          )}
        </>
      );

    if (activeRibbon === "Xem")
      return (
        <span style={{ fontSize: 12, color: "#6b7280" }}>
          {wordCount} từ • {charCount} ký tự • {pages.length} trang • Zoom{" "}
          {zoom}%
        </span>
      );

    return null;
  };

  /* ── RENDER ── */
  return (
    <div
      className="de-overlay"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="de-modal">
        {/* Title bar */}
        <div className="de-titlebar">
          <div className="de-titlebar-left">
            <div className="de-word-logo">W</div>
          </div>
          <div className="de-titlebar-center">
            <span className="de-title-name">{doc.fileName}</span>
            <span className="de-title-status">
              {saved
                ? "✓ Đã lưu lên server"
                : modified
                  ? "● Có thay đổi chưa lưu"
                  : "AI Mentor — Trình soạn thảo"}
            </span>
          </div>
          <div className="de-titlebar-right">
            <button className="de-title-btn close" onClick={handleClose}>
              <X size={13} /> Đóng
            </button>
            <button className="de-title-btn download" onClick={handleDownload}>
              <Download size={13} /> Tải về .docx
            </button>
            <button
              className="de-title-btn save"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={13} />
              {saving ? "Đang lưu..." : "Lưu (Ctrl+S)"}
            </button>
          </div>
        </div>

        {/* Ribbon tabs */}
        <div className="de-ribbon-tabs">
          {RIBBON_TABS.map((tab) => (
            <button
              key={tab}
              className={`de-ribbon-tab ${activeRibbon === tab ? "active" : ""}`}
              onClick={() => setActiveRibbon(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="de-toolbar">{renderToolbar()}</div>

        {/* Find & Replace */}
        {showFind && (
          <div className="de-find-bar">
            <span className="de-find-label">Tìm:</span>
            <input
              className="de-find-input"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFind()}
              placeholder="Từ cần tìm..."
            />
            <button className="de-find-btn" onClick={handleFind}>
              Tìm & tô màu
            </button>
            <div className="de-toolbar-sep" />
            <span className="de-find-label">Thay bằng:</span>
            <input
              className="de-find-input"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Từ thay thế..."
            />
            <button className="de-find-btn primary" onClick={handleReplace}>
              Thay tất cả
            </button>
            {replaceCount !== null && (
              <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>
                ✓ Đã thay {replaceCount} chỗ
              </span>
            )}
            <button className="de-find-btn" onClick={() => setShowFind(false)}>
              ✕
            </button>
          </div>
        )}

        {/* ── Editor area ── */}
        <div className="de-editor-area">
          {pages.map((_, pageIdx) => (
            <div
              key={pageIdx}
              className={`de-page-wrapper ${currentPage === pageIdx ? "active" : ""}`}
              onClick={() => setCurrentPage(pageIdx)}
            >
              {/* Page label phía trên */}
              <div className="de-page-label">
                Trang {pageIdx + 1} / {pages.length}
              </div>

              {/* A4 page */}
              <div className="de-page" data-page={pageIdx + 1}>
                <div
                  ref={(el) => {
                    pageRefs.current[pageIdx] = el;
                  }}
                  className="de-content"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={() => handlePageInput(pageIdx)}
                  onKeyDown={(e) => handlePageKeyDown(e, pageIdx)}
                  onFocus={() => setCurrentPage(pageIdx)}
                  style={{
                    transform:
                      zoom !== 100 ? `scale(${zoom / 100})` : undefined,
                    transformOrigin: "top left",
                    width: zoom !== 100 ? `${10000 / zoom}%` : "100%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Status bar */}
        <div className="de-statusbar">
          <div className="de-statusbar-left">
            <span>{wordCount} từ</span>
            <span>{charCount} ký tự</span>
            {/* Điều hướng trang */}
            <div className="de-page-nav">
              <button
                className="de-page-nav-btn"
                disabled={currentPage === 0}
                onClick={() => {
                  const prev = Math.max(0, currentPage - 1);
                  setCurrentPage(prev);
                  pageRefs.current[prev]?.focus();
                  pageRefs.current[prev]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
              >
                <ChevronLeft size={12} />
              </button>
              <span>
                Trang {currentPage + 1} / {pages.length}
              </span>
              <button
                className="de-page-nav-btn"
                disabled={currentPage === pages.length - 1}
                onClick={() => {
                  const next = Math.min(pages.length - 1, currentPage + 1);
                  setCurrentPage(next);
                  pageRefs.current[next]?.focus();
                  pageRefs.current[next]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
              >
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
          <div className="de-statusbar-right">
            {saved && (
              <span className="de-status-dot saved">
                <CheckCircle2 size={10} /> Đã lưu
              </span>
            )}
            {modified && !saved && (
              <span className="de-status-dot modified">
                <Circle size={10} /> Chưa lưu — Ctrl+S
              </span>
            )}
            <span>Zoom {zoom}%</span>
          </div>
        </div>
      </div>

      {/* Hidden inputs */}
      <input
        ref={imgInputRef}
        type="file"
        accept="image/*"
        className="de-hidden"
        onChange={handleImageFile}
      />
    </div>
  );
}
