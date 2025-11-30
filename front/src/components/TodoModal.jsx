import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Calendar from "react-calendar";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import "react-calendar/dist/Calendar.css";
import "./TodoModal.css";
import { ReactComponent as CalendarIcon } from "../assets/calendar.svg";

Modal.setAppElement("#root");

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function TodoModal({ isOpen, onClose, onSubmit, editingTodo }) {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [content, setContent] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (editingTodo) {
      // 수정 모드: 데이터 채워넣기
      const existingDate = editingTodo.dueDate ? new Date(editingTodo.dueDate) : null;
      setDate(existingDate);
      
      const timeStr = editingTodo.dueDate
        ? new Date(editingTodo.dueDate).toISOString().slice(11, 16)
        : "";
      setTime(timeStr);
      setContent(editingTodo.content || "");
    } else if (isOpen) { 
      // 작성 모드(모달 열릴 때): 초기화
      setDate(null); // 날짜 선택 안 된 상태
      setTime("");
      setContent("");
      setShowCalendar(false);
    }
  }, [editingTodo, isOpen]);

  const handleClose = () => {
    setShowCalendar(false);
    onClose();
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setShowCalendar(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 날짜가 선택되었는지 확인
    if (!date) {
        alert("날짜를 선택해주세요.");
        return;
    }
    if (!time || !content.trim()) {
      alert("시간과 내용을 모두 입력해주세요.");
      return;
    }

    const dateStr = format(date, "yyyy-MM-dd");
    
    onSubmit({
      date: dateStr,
      time,
      content,
    });
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="todo-modal"
      overlayClassName="todo-modal-backdrop"
      contentLabel={editingTodo ? "TODO 수정 모달" : "TODO 작성 모달"}
    >
      <h2 className="modal-title">{editingTodo ? "TODO 수정" : "TODO 작성"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="todo-modal-field date-field">
          <div 
            className={`input-display ${!date ? "placeholder" : ""}`} 
            onClick={() => setShowCalendar(!showCalendar)}
          >
            {/* 날짜가 있으면 포맷팅, 없으면 Placeholder 텍스트 표시 */}
            {date ? format(date, "yyyy년 MM월 dd일", { locale: ko }) : "날짜를 선택해주세요"}
            <span className="calendar-icon"><CalendarIcon /></span>
          </div>
          
          {/* 달력 팝업 */}
          {showCalendar && (
            <div className="calendar-popup">
              <Calendar 
                onChange={handleDateChange} 
                value={date || new Date()} // 선택 안됐으면 오늘 날짜 기준 달력 보여줌
                formatDay={(locale, date) => format(date, "d")}
                calendarType="gregory"
                prev2Label={null}
                next2Label={null}
                formatShortWeekday={(locale, date) => weekDays[date.getDay()]} // 영문 요일 표기
              />
            </div>
          )}
        </div>

        <div className="todo-modal-field">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
        </div>

        <div className="todo-modal-field">
            <textarea
              placeholder="* TODO를 작성해주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            />
        </div>

        <div className="todo-modal-buttons">
          <button type="button" className="cancel-btn" onClick={handleClose}>
            취소
          </button>
          <button type="submit" className="submit-btn">
            {editingTodo ? "수정" : "작성"}
          </button>
        </div>
      </form>
    </Modal>
  );
}