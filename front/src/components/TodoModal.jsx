import React, { useState, useEffect } from "react";
import "./TodoModal.css"; 

export default function TodoModal({ isOpen, onClose, onSubmit, editingTodo }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [content, setContent] = useState("");

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

  // 모달이 닫힐 때 입력값도 함께 초기화
  const handleClose = () => {
    setDate("");
    setTime("");
    setContent("");
    onClose(); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !time || !content.trim()) {
      alert("날짜, 시간, 내용을 모두 입력해주세요.");
      return;
    }

    onSubmit({
      date,
      time,
      content,
    });

    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="todo-modal-backdrop">
      <div className="todo-modal">
        <h2>{editingTodo ? "TODO 수정" : "TODO 작성"}</h2>

        <form onSubmit={handleSubmit}>
          {/* 날짜 입력 */}
          <div className="todo-modal-field">
            <label>날짜를 선택해주세요</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* 시간 입력 */}
          <div className="todo-modal-field">
            <label>시간을 입력해주세요</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          {/* 내용 입력 */}
          <div className="todo-modal-field">
            <label>* TODO를 작성해주세요</label>
            <textarea
              placeholder="TODO 내용을 입력해주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* 버튼 영역 */}
          <div className="todo-modal-buttons">
            <button type="button" className="cancel-btn" onClick={handleClose}>
              취소
            </button>
            <button type="submit" className="submit-btn">
              {editingTodo ? "수정" : "작성"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}