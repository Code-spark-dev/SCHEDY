import React from "react";
import "./TodoItem.css";

export default function TodoItem({ todo, onEdit, onDelete }) {
  return (
    <li className="todo_item">
      <div className="todo_info">
        {(todo.day || todo.year || todo.month) && (
          <div className="todo_date">
            {todo.day && <span className="todo_day">{todo.day}</span>}
            {(todo.year || todo.month) && (
              <div className="flex_box">
                {todo.year && <span className="todo_year">{todo.year}.</span>}
                {todo.month && <span className="todo_month">{todo.month}</span>}
              </div>
            )}
          </div>
        )}
        
        <div className="todo_text">
          {todo.time && <span className="todo_time">{todo.time}</span>}
          <p className="todo_content">{todo.content}</p>
        </div>
      </div>
      <div className="todo_btn">
        <button className="edit_btn" onClick={onEdit}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-1 2q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z"/>
          </svg>
        </button>
        <button className="delete_btn" onClick={onDelete}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z"/>
          </svg>
        </button>
      </div>
    </li>
  );
}
