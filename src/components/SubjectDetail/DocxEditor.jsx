import { useEffect, useRef, useState, useCallback } from "react";
import {
  X, Download, Save, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Image, Table, Link, Strikethrough,
  Subscript, Superscript, Search, CheckCircle2, Circle,
  Highlighter, Quote, Undo2, Redo2, Minus,
} from "lucide-react";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table as DocxTable, TableRow, TableCell, WidthType, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import { editDocument } from "../../services/document.services";
import "./DocxEditor.css";

const FONTS  = ["Calibri","Times New Roman","Arial","Verdana","Georgia","Courier New","Tahoma"];
const FSIZES = [8,9,10,11,12,14,16,18,20,22,24,28,32,36,48,72];
const RIBBON_TABS = ["Trang chủ","Chèn","Bố cục","Xem"];

export default function DocxEditor({ doc, subjectId, onClose, onSaved }) {
  const editorRef    = useRef(null);
  const imgInputRef  = useRef(null);

  const [activeRibbon, setActiveRibbon]  = useState("Trang chủ");
  const [saving,   setSaving]            = useState(false);
  const [modified, setModified]          = useState(false);
  const [saved,    setSaved]             = useState(false);
  const [wordCount, setWordCount]        = useState(0);
  const [charCount, setCharCount]        = useState(0);
  const [showFind,  setShowFind]         = useState(false);
  const [findText,  setFindText]         = useState("");
  const [replaceText, setReplaceText]    = useState("");
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [tableHover, setTableHover]      = useState({ r: 0, c: 0 });
  const [zoom, setZoom]                  = useState(100);

  /* ── Khởi tạo nội dung ── */
  useEffect(() => {
    if (!editorRef.current) return;
    const text = doc.extractedText ?? "";
    const html = text.split("\n")
      .map(l => l.trim() ? `<p>${l}</p>` : `<p><br></p>`)
      .join("");
    editorRef.current.innerHTML = html || "<p><br></p>";
    countStats();
    editorRef.current.focus();
  }, [doc]);

  /* ── Đếm từ / ký tự ── */
  const countStats = useCallback(() => {
    const text = editorRef.current?.innerText ?? "";
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    setCharCount(text.replace(/\s/g, "").length);
  }, []);

  const handleInput = () => {
    setModified(true);
    setSaved(false);
    countStats();
  };

  /* ── execCommand helper ── */
  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
  };
  const isActive = (cmd) => {
    try { return document.queryCommandState(cmd); } catch { return false; }
  };

  /* ── Keyboard shortcuts ── */
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); handleSave(); }
    if ((e.ctrlKey || e.metaKey) && e.key === "f") { e.preventDefault(); setShowFind(v => !v); }
  };

  /* ── Find & Replace ── */
  const handleFind = () => {
    if (!findText) return;
    const sel = window.getSelection();
    const range = document.createRange();
    const walker = document.createTreeWalker(
      editorRef.current, NodeFilter.SHOW_TEXT
    );
    while (walker.nextNode()) {
      const idx = walker.currentNode.textContent.indexOf(findText);
      if (idx !== -1) {
        range.setStart(walker.currentNode, idx);
        range.setEnd(walker.currentNode, idx + findText.length);
        sel.removeAllRanges();
        sel.addRange(range);
        break;
      }
    }
  };

  const handleReplace = () => {
    if (!findText) return;
    exec("insertText", replaceText);
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    const html = editorRef.current.innerHTML;
    const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    editorRef.current.innerHTML = html.replace(
      new RegExp(escaped, "gi"), replaceText
    );
    setModified(true);
  };

  /* ── Insert table ── */
  const insertTable = (rows, cols) => {
    let tableHtml = `<table><tbody>`;
    for (let r = 0; r < rows; r++) {
      tableHtml += "<tr>";
      for (let c = 0; c < cols; c++) {
        tableHtml += r === 0
          ? `<th contenteditable="true">&nbsp;</th>`
          : `<td contenteditable="true">&nbsp;</td>`;
      }
      tableHtml += "</tr>";
    }
    tableHtml += "</tbody></table><p><br></p>";
    exec("insertHTML", tableHtml);
    setShowTablePicker(false);
  };

  /* ── Insert image ── */
  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      exec("insertHTML",
        `<img src="${ev.target.result}" style="max-width:100%;border-radius:4px;" />`
      );
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  /* ── Insert link ── */
  const insertLink = () => {
    const url = window.prompt("Nhập URL:", "https://");
    if (url) exec("createLink", url);
  };

  /* ── Lấy plain text ── */
  const getPlainText = () => {
    const lines = [];
    editorRef.current?.childNodes.forEach(node => {
      lines.push(node.innerText ?? node.textContent ?? "");
    });
    return lines.join("\n");
  };

  /* ── Lưu lên BE ── */
  const handleSave = async () => {
    setSaving(true);
    try {
      const content = getPlainText();
      const updated = await editDocument(subjectId, doc.documentId, content);
      onSaved?.(updated);
      setModified(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Lưu thất bại!");
    } finally {
      setSaving(false);
    }
  };

  /* ── Tải về DOCX ── */
  const handleDownload = async () => {
    const paragraphs = [];
    const nodes = editorRef.current?.childNodes ?? [];

    nodes.forEach(node => {
      const tag  = node.nodeName.toLowerCase();
      const text = node.innerText ?? node.textContent ?? "";

      const makeRun = (n) => new TextRun({
        text: n.innerText ?? n.textContent ?? "",
        bold:      n.style?.fontWeight === "bold"   || !!n.closest?.("b,strong"),
        italics:   n.style?.fontStyle  === "italic" || !!n.closest?.("i,em"),
        underline: !!n.querySelector?.("u") ? {} : undefined,
        size: 24,
        font: "Calibri",
      });

      if (tag === "h1") {
        paragraphs.push(new Paragraph({ text, heading: HeadingLevel.HEADING_1 }));
      } else if (tag === "h2") {
        paragraphs.push(new Paragraph({ text, heading: HeadingLevel.HEADING_2 }));
      } else if (tag === "h3") {
        paragraphs.push(new Paragraph({ text, heading: HeadingLevel.HEADING_3 }));
      } else if (tag === "blockquote") {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text, italics: true, color: "475569" })],
          indent: { left: 720 },
        }));
      } else {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text, size: 24, font: "Calibri" })],
          spacing: { after: 120 },
        }));
      }
    });

    if (paragraphs.length === 0) {
      paragraphs.push(new Paragraph({ children: [new TextRun("")] }));
    }

    const docxFile = new Document({
      sections: [{
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 },
          },
        },
        children: paragraphs,
      }],
    });

    const blob = await Packer.toBlob(docxFile);
    const base = doc.fileName.replace(/\.[^/.]+$/, "");
    saveAs(blob, `${base}_edited.docx`);
  };

  /* ── Đóng ── */
  const handleClose = () => {
    if (modified && !window.confirm("Có thay đổi chưa lưu. Thoát không?")) return;
    onClose();
  };

  /* ── Render toolbar theo tab ribbon ── */
  const renderToolbar = () => {
    if (activeRibbon === "Trang chủ") return (
      <>
        {/* Font family */}
        <select className="de-select" style={{ width: 110 }}
          onChange={e => exec("fontName", e.target.value)}>
          {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        {/* Font size */}
        <select className="de-select" style={{ width: 52 }}
          defaultValue="14"
          onChange={e => exec("fontSize",
            ["","","","","","","",""][0] /* fallback */ ||
            (() => {
              const pt = parseInt(e.target.value);
              const map = {8:1,10:2,12:3,14:4,18:5,24:6,36:7};
              return map[pt] ?? 4;
            })()
          )}>
          {FSIZES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <div className="de-toolbar-sep" />

        {/* Text formatting */}
        <div className="de-toolbar-group">
          <button className={`de-tool-btn ${isActive("bold") ? "active":""}`}
            onClick={() => exec("bold")} title="Đậm (Ctrl+B)">
            <Bold size={13}/>
          </button>
          <button className={`de-tool-btn ${isActive("italic") ? "active":""}`}
            onClick={() => exec("italic")} title="Nghiêng (Ctrl+I)">
            <Italic size={13}/>
          </button>
          <button className={`de-tool-btn ${isActive("underline") ? "active":""}`}
            onClick={() => exec("underline")} title="Gạch dưới (Ctrl+U)">
            <Underline size={13}/>
          </button>
          <button className={`de-tool-btn ${isActive("strikeThrough") ? "active":""}`}
            onClick={() => exec("strikeThrough")} title="Gạch ngang">
            <Strikethrough size={13}/>
          </button>
          <button className="de-tool-btn"
            onClick={() => exec("subscript")} title="Chỉ số dưới">
            <Subscript size={13}/>
          </button>
          <button className="de-tool-btn"
            onClick={() => exec("superscript")} title="Chỉ số trên">
            <Superscript size={13}/>
          </button>
        </div>

        <div className="de-toolbar-sep" />

        {/* Màu */}
        <div className="de-toolbar-group">
          <input type="color" className="de-color-btn"
            title="Màu chữ"
            onChange={e => exec("foreColor", e.target.value)}
            defaultValue="#111111"/>
          <input type="color" className="de-color-btn"
            title="Tô màu nền chữ"
            onChange={e => exec("hiliteColor", e.target.value)}
            defaultValue="#ffff00"/>
        </div>

        <div className="de-toolbar-sep" />

        {/* Heading */}
        <select className="de-select" style={{ width: 100 }}
          defaultValue=""
          onChange={e => {
            const v = e.target.value;
            if (!v) exec("formatBlock", "p");
            else exec("formatBlock", v);
            e.target.value = "";
          }}>
          <option value="">Đoạn văn</option>
          <option value="h1">Tiêu đề 1</option>
          <option value="h2">Tiêu đề 2</option>
          <option value="h3">Tiêu đề 3</option>
          <option value="blockquote">Trích dẫn</option>
          <option value="pre">Code</option>
        </select>

        <div className="de-toolbar-sep" />

        {/* Alignment */}
        <div className="de-toolbar-group">
          <button className="de-tool-btn" onClick={() => exec("justifyLeft")} title="Căn trái">
            <AlignLeft size={13}/>
          </button>
          <button className="de-tool-btn" onClick={() => exec("justifyCenter")} title="Căn giữa">
            <AlignCenter size={13}/>
          </button>
          <button className="de-tool-btn" onClick={() => exec("justifyRight")} title="Căn phải">
            <AlignRight size={13}/>
          </button>
          <button className="de-tool-btn" onClick={() => exec("justifyFull")} title="Căn đều">
            <AlignJustify size={13}/>
          </button>
        </div>

        <div className="de-toolbar-sep" />

        {/* Lists */}
        <div className="de-toolbar-group">
          <button className="de-tool-btn"
            onClick={() => exec("insertUnorderedList")} title="Danh sách bullet">
            <List size={13}/>
          </button>
          <button className="de-tool-btn"
            onClick={() => exec("insertOrderedList")} title="Danh sách số">
            <ListOrdered size={13}/>
          </button>
          <button className="de-tool-btn"
            onClick={() => exec("indent")} title="Tăng thụt lề">
            →
          </button>
          <button className="de-tool-btn"
            onClick={() => exec("outdent")} title="Giảm thụt lề">
            ←
          </button>
        </div>

        <div className="de-toolbar-sep" />

        {/* Undo / Redo */}
        <div className="de-toolbar-group">
          <button className="de-tool-btn"
            onClick={() => exec("undo")} title="Hoàn tác (Ctrl+Z)">
            <Undo2 size={13}/>
          </button>
          <button className="de-tool-btn"
            onClick={() => exec("redo")} title="Làm lại (Ctrl+Y)">
            <Redo2 size={13}/>
          </button>
        </div>

        <div className="de-toolbar-sep" />

        {/* Find */}
        <button className="de-tool-btn"
          onClick={() => setShowFind(v => !v)} title="Tìm & Thay thế (Ctrl+F)">
          <Search size={13}/>
        </button>
      </>
    );

    if (activeRibbon === "Chèn") return (
      <>
        {/* Table picker */}
        <div style={{ position: "relative" }}>
          <button className="de-tool-btn"
            onClick={() => setShowTablePicker(v => !v)} title="Chèn bảng">
            <Table size={13}/>
          </button>
          {showTablePicker && (
            <div className="de-table-picker">
              <div className="de-table-grid">
                {Array.from({length: 8}, (_, r) =>
                  Array.from({length: 8}, (_, c) => (
                    <div key={`${r}-${c}`}
                      className={`de-table-cell ${r <= tableHover.r && c <= tableHover.c ? "hover":""}`}
                      onMouseEnter={() => setTableHover({r, c})}
                      onClick={() => insertTable(r + 1, c + 1)}
                    />
                  ))
                )}
              </div>
              <div className="de-table-hint">
                {tableHover.r+1} × {tableHover.c+1}
              </div>
            </div>
          )}
        </div>

        {/* Image */}
        <button className="de-tool-btn"
          onClick={() => imgInputRef.current?.click()} title="Chèn ảnh">
          <Image size={13}/>
        </button>

        {/* Link */}
        <button className="de-tool-btn" onClick={insertLink} title="Chèn liên kết">
          <Link size={13}/>
        </button>

        {/* Horizontal rule */}
        <button className="de-tool-btn"
          onClick={() => exec("insertHorizontalRule")} title="Đường kẻ ngang">
          <Minus size={13}/>
        </button>

        {/* Blockquote */}
        <button className="de-tool-btn"
          onClick={() => exec("formatBlock", "blockquote")} title="Trích dẫn">
          <Quote size={13}/>
        </button>
      </>
    );

    if (activeRibbon === "Bố cục") return (
      <>
        <span className="de-find-label">Zoom:</span>
        <select className="de-select"
          value={zoom}
          onChange={e => setZoom(Number(e.target.value))}>
          {[50,75,90,100,110,125,150,175,200].map(z =>
            <option key={z} value={z}>{z}%</option>
          )}
        </select>
        <div className="de-toolbar-sep"/>
        <button className="de-tool-btn"
          onClick={() => exec("formatBlock","p")} title="Xóa định dạng">
          Bỏ định dạng
        </button>
      </>
    );

    if (activeRibbon === "Xem") return (
      <>
        <span style={{fontSize:12, color:"#64748b"}}>
          {wordCount} từ • {charCount} ký tự
        </span>
      </>
    );

    return null;
  };

  return (
    <div className="de-overlay"
      onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className="de-modal">

        {/* ── Title bar ── */}
        <div className="de-titlebar">
          <div className="de-titlebar-left">
            <div className="de-word-logo">W</div>
            <span className="de-title-filename">{doc.fileName}</span>
            <span className="de-title-saved">
              {saved ? "• Đã lưu" : modified ? "• Chưa lưu" : ""}
            </span>
          </div>
          <div className="de-titlebar-right">
            <button className="de-title-btn close" onClick={handleClose}>
              <X size={14}/> Đóng
            </button>
            <button className="de-title-btn download" onClick={handleDownload}>
              <Download size={14}/> Tải về .docx
            </button>
            <button className="de-title-btn save"
              onClick={handleSave} disabled={saving}>
              <Save size={14}/>
              {saving ? "Đang lưu..." : "Lưu (Ctrl+S)"}
            </button>
          </div>
        </div>

        {/* ── Ribbon tabs ── */}
        <div className="de-ribbon-tabs">
          {RIBBON_TABS.map(tab => (
            <button key={tab}
              className={`de-ribbon-tab ${activeRibbon === tab ? "active":""}`}
              onClick={() => setActiveRibbon(tab)}>
              {tab}
            </button>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="de-toolbar">
          {renderToolbar()}
        </div>

        {/* ── Find & Replace bar ── */}
        {showFind && (
          <div className="de-find-bar">
            <span className="de-find-label">Tìm:</span>
            <input className="de-find-input"
              value={findText}
              onChange={e => setFindText(e.target.value)}
              placeholder="Từ cần tìm..."
              onKeyDown={e => e.key === "Enter" && handleFind()}
            />
            <button className="de-find-btn" onClick={handleFind}>
              Tìm tiếp
            </button>
            <span className="de-find-label">Thay bằng:</span>
            <input className="de-find-input"
              value={replaceText}
              onChange={e => setReplaceText(e.target.value)}
              placeholder="Từ thay thế..."
            />
            <button className="de-find-btn replace" onClick={handleReplace}>
              Thay thế
            </button>
            <button className="de-find-btn replace" onClick={handleReplaceAll}>
              Thay tất cả
            </button>
            <button className="de-find-btn"
              onClick={() => setShowFind(false)}>✕</button>
          </div>
        )}

        {/* ── Editor area ── */}
        <div className="de-editor-area">
          <div className="de-page">
            <div
              ref={editorRef}
              className="de-content"
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              style={{ transform: `scale(${zoom/100})`, transformOrigin: "top left",
                width: zoom !== 100 ? `${10000/zoom}%` : "100%" }}
            />
          </div>
        </div>

        {/* ── Status bar ── */}
        <div className="de-statusbar">
          <div className="de-statusbar-left">
            <span>{wordCount} từ • {charCount} ký tự</span>
            <span>Trang 1</span>
          </div>
          <div className="de-statusbar-right">
            {saved && (
              <span className="de-status-pill saved">
                <CheckCircle2 size={10}/> Đã lưu
              </span>
            )}
            {modified && !saved && (
              <span className="de-status-pill modified">
                <Circle size={10}/> Chưa lưu
              </span>
            )}
            <span>Zoom {zoom}%</span>
          </div>
        </div>

      </div>

      {/* Hidden image input */}
      <input ref={imgInputRef} type="file"
        accept="image/*" className="de-img-input"
        onChange={handleImageFile}
      />
    </div>
  );
}