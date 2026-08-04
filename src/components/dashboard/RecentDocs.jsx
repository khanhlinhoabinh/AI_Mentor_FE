import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Presentation, File, Layers } from "lucide-react";
import { toast } from "react-toastify";

import { getSubjects } from "../../services/subject.services";
import {
  getDocumentsBySubject,
  viewDocument,
  openFile,
} from "../../services/document.services";
import { getFlashcardSets } from "../../services/flashcard.services";

const MAX_ITEMS = 4;

function formatRelativeTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay} ngày trước`;

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function ItemIcon({ item }) {
  if (item.type === "flashcard") {
    return (
      <div className="doc-icon purple">
        <Layers size={22} />
      </div>
    );
  }

  const type = (item.fileType || "").toUpperCase();
  if (type === "PDF") {
    return (
      <div className="doc-icon red">
        <FileText size={22} />
      </div>
    );
  }
  if (type === "PPTX") {
    return (
      <div className="doc-icon orange">
        <Presentation size={22} />
      </div>
    );
  }
  return (
    <div className="doc-icon blue">
      <File size={22} />
    </div>
  );
}

export default function RecentDocs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadRecentActivity = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setItems([]);
        return;
      }

      const subjects = (await getSubjects()) || [];
      const subjectNameById = new Map(
        subjects.map((s) => [String(s.subjectId), s.subjectName])
      );

      // Gọi song song: tài liệu của từng môn học + toàn bộ bộ flashcard
      const [docResults, setsRes] = await Promise.all([
        Promise.allSettled(
          subjects.map((s) => getDocumentsBySubject(s.subjectId))
        ),
        getFlashcardSets().catch(() => ({ data: [] })),
      ]);

      const docItems = docResults.flatMap((r, i) => {
        if (r.status !== "fulfilled") return [];
        const subjectId = subjects[i].subjectId;
        return (r.value || []).map((d) => ({
          id: `doc-${d.documentId}`,
          type: "document",
          title: d.fileName,
          fileType: d.fileType,
          subjectId,
          documentId: d.documentId,
          subjectName: subjects[i].subjectName,
          date: d.lastEditedAt || d.createdAt,
        }));
      });

      const flashcardItems = (setsRes?.data || []).map((s) => ({
        id: `set-${s.flashcardSetId}`,
        type: "flashcard",
        title: s.setName,
        flashcardSetId: s.flashcardSetId,
        subjectName: subjectNameById.get(String(s.subjectId)) || "",
        totalCards: s.totalCards,
        date: s.createdAt,
      }));

      const merged = [...docItems, ...flashcardItems]
        .filter((item) => item.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, MAX_ITEMS);

      setItems(merged);
    } catch (error) {
      console.error("Load recent activity failed:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecentActivity();
  }, [loadRecentActivity]);

  const handleOpen = async (item) => {
    if (item.type === "flashcard") {
      navigate(`/flashcard-sets/${item.flashcardSetId}/edit`);
      return;
    }

    try {
      await viewDocument(item.subjectId, item.documentId);
      await openFile(item.subjectId, item.documentId);
    } catch (error) {
      console.error("Open document failed:", error);
      toast.error("Không thể mở tài liệu này");
    }
  };

  return (
    <section className="section">
      <div className="section-header">
        <h3>Hoạt động học tập gần đây</h3>
        <button onClick={() => navigate("/mysubjects")}>Xem tất cả</button>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : items.length === 0 ? (
        <p>Chưa có hoạt động học tập nào gần đây.</p>
      ) : (
        <div className="docs-grid">
          {items.map((item) => (
            <div
              key={item.id}
              className="doc-card"
              role="button"
              tabIndex={0}
              onClick={() => handleOpen(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleOpen(item);
              }}
            >
              <ItemIcon item={item} />
              <div>
                <h4>{item.title}</h4>
                <p>
                  {item.type === "flashcard"
                    ? `Flashcard • ${item.totalCards ?? 0} thẻ`
                    : item.fileType}
                  {item.subjectName ? ` • ${item.subjectName}` : ""}
                  {" • "}
                  {formatRelativeTime(item.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
