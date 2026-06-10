import React, { useState, useRef, useEffect, useCallback } from "react";
import ChatWindow from "./ChatWindow";
import "./FloatingAssistant.css";

const STORAGE_KEY = "ai_assistant_position";
const DEFAULT_POS = { x: null, y: null }; // null = use CSS default (bottom-right)

const clampPosition = (x, y, width = 64, height = 64) => {
  const maxX = window.innerWidth - width - 16;
  const maxY = window.innerHeight - height - 16;
  return {
    x: Math.max(16, Math.min(x, maxX)),
    y: Math.max(16, Math.min(y, maxY)),
  };
};

const loadPosition = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_POS;
};

const savePosition = (pos) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
};

const FloatingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(loadPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);

  const dragRef = useRef(null);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, elemX: 0, elemY: 0 });

  const getInitialPos = () => {
    if (position.x !== null && position.y !== null) return position;
    return {
      x: window.innerWidth - 80,
      y: window.innerHeight - 80,
    };
  };

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();

    const pos = getInitialPos();
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      elemX: pos.x,
      elemY: pos.y,
    };
    setHasDragged(false);
    setIsDragging(true);
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const dx = e.clientX - dragStart.current.mouseX;
      const dy = e.clientY - dragStart.current.mouseY;

      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        setHasDragged(true);
      }

      const newX = dragStart.current.elemX + dx;
      const newY = dragStart.current.elemY + dy;
      const clamped = clampPosition(newX, newY);
      setPosition(clamped);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setPosition((prev) => {
        savePosition(prev);
        return prev;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Touch support
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    const pos = getInitialPos();
    dragStart.current = {
      mouseX: touch.clientX,
      mouseY: touch.clientY,
      elemX: pos.x,
      elemY: pos.y,
    };
    setHasDragged(false);
    setIsDragging(true);
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const dx = touch.clientX - dragStart.current.mouseX;
      const dy = touch.clientY - dragStart.current.mouseY;

      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        setHasDragged(true);
      }

      const newX = dragStart.current.elemX + dx;
      const newY = dragStart.current.elemY + dy;
      const clamped = clampPosition(newX, newY);
      setPosition(clamped);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      setPosition((prev) => {
        savePosition(prev);
        return prev;
      });
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  const handleClick = () => {
    if (hasDragged) return;
    setIsOpen((v) => !v);
  };

  const pos = getInitialPos();
  const style = {
    position: "fixed",
    left: pos.x,
    top: pos.y,
    zIndex: 9999,
    cursor: isDragging ? "grabbing" : "grab",
    userSelect: "none",
  };

  return (
    <div style={style} ref={dragRef}>
      {/* Chat window opens above/beside the avatar */}
      {isOpen && (
        <div className="chat-window-anchor">
          <ChatWindow
            onClose={() => setIsOpen(false)}
            onMinimize={() => setIsOpen(false)}
          />
        </div>
      )}

      {/* Floating avatar button */}
      <button
        className={`floating-avatar${isDragging ? " floating-avatar--dragging" : ""}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
        title="AI Mentor"
        type="button"
        aria-label="Mở AI Mentor"
      >
        <span className="floating-avatar-icon">🌱</span>
        <span className="floating-online-badge" />
        {!isOpen && (
          <span className="floating-pulse" />
        )}
      </button>
    </div>
  );
};

export default FloatingAssistant;
