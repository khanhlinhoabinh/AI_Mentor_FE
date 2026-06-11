import React from "react";
import "./FloatingAssistant.css";

const DEFAULT_SUGGESTIONS = [
  "Giải thích khái niệm này",
  "Cho ví dụ minh họa",
  "Tóm tắt nội dung",
  "Bài tập thực hành",
];

const SuggestionChips = ({ suggestions = DEFAULT_SUGGESTIONS, onSelect }) => {
  return (
    <div className="suggestion-chips">
      {suggestions.map((s, i) => (
        <button
          key={i}
          className="suggestion-chip"
          onClick={() => onSelect(s)}
          type="button"
        >
          {s}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;
