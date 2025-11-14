import React, { useState, useEffect } from "react";

export default function TodoModal({ isOpen, onClose, onSubmit, editingTodo }) {
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (editingTodo) {
      const dateStr = editingTodo.dueDate?.slice(0, 10) || "";
      const timeStr = editingTodo.dueDate
        ? new Date(editingTodo.dueDate).toISOString().slice(11, 16)
        : "";
      setDate(dateStr);
      setTime(timeStr);
      setContent(editingTodo.content || "");
    }
  }, [editingTodo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content || !date || !time) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    onSubmit({ content, date, time });
  };

  const handleClose = () => {
    setContent("");
    setDate("");
    setTime("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{editingTodo ? "TODO 수정" : "TODO 작성"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            내용:
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>
          <label>
            날짜:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label>
            시간:
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
          <button type="submit">{editingTodo ? "수정" : "작성"}</button>
          <button type="button" onClick={handleClose}>
            닫기
          </button>
        </form>
      </div>
    </div>
  );
}