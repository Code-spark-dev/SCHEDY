import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import TodoItem from "../components/TodoItem";
import todosData from "../data/todoContents.json";

export default function Home() {
  const [plannedTodos, setPlannedTodos] = useState([]);
  const [ongoingTodos, setOngoingTodos] = useState([]);
  const [completeTodos, setCompleteTodos] = useState([]);

  useEffect(() => {
    setPlannedTodos(todosData.planned || []);
    setOngoingTodos(todosData.ongoing || []);
    setCompleteTodos(todosData.complete || []);
  }, []);

  const renderTodoList = (todos, emptyMsg) =>
    todos.length === 0 ? (
      <li className="empty_msg">{emptyMsg}</li>
    ) : (
      todos.map((todo, idx) => (
        <TodoItem
          key={idx}
          todo={todo}
          onEdit={() => console.log("edit", todo)}
          onDelete={() => console.log("delete", todo)}
        />
      ))
    );

  return (
    <main className="home">
      {/* Planned */}
      <section className="todo_section planned">
        <div className="title_box">
          <svg className="title_icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M10 19q-.425 0-.712-.288T9 18t.288-.712T10 17h10q.425 0 .713.288T21 18t-.288.713T20 19zm0-6q-.425 0-.712-.288T9 12t.288-.712T10 11h10q.425 0 .713.288T21 12t-.288.713T20 13zm0-6q-.425 0-.712-.288T9 6t.288-.712T10 5h10q.425 0 .713.288T21 6t-.288.713T20 7zM5 20q-.825 0-1.412-.587T3 18t.588-1.412T5 16t1.413.588T7 18t-.587 1.413T5 20m0-6q-.825 0-1.412-.587T3 12t.588-1.412T5 10t1.413.588T7 12t-.587 1.413T5 14m0-6q-.825 0-1.412-.587T3 6t.588-1.412T5 4t1.413.588T7 6t-.587 1.413T5 8"/>
          </svg>
          <h2>Planned</h2>
        </div>

        <ul className={`todo_list ${plannedTodos.length === 0 ? "empty" : ""}`}>
          {renderTodoList(plannedTodos, "TODO를 추가해주세요.")}
        </ul>
      </section>

      {/* Ongoing */}
      <section className="todo_section ongoing">
        <div className="title_box">
          <svg className="title_icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="m13 12.175l2.25 2.25q.275.275.275.688t-.275.712q-.3.3-.712.3t-.713-.3L11.3 13.3q-.15-.15-.225-.337T11 12.575V9q0-.425.288-.712T12 8t.713.288T13 9zM12 6q-.425 0-.712-.288T11 5V4h2v1q0 .425-.288.713T12 6m6 6q0-.425.288-.712T19 11h1v2h-1q-.425 0-.712-.288T18 12m-6 6q.425 0 .713.288T13 19v1h-2v-1q0-.425.288-.712T12 18m-6-6q0 .425-.288.713T5 13H4v-2h1q.425 0 .713.288T6 12m6 10q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m8-10q0-3.35-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20t5.675-2.325T20 12m-8 0"/>
          </svg>
          <h2>Ongoing</h2>
        </div>

        <ul className={`todo_list ${ongoingTodos.length === 0 ? "empty" : ""}`}>
          {renderTodoList(ongoingTodos, "진행중인 TODO가 없습니다.")}
        </ul>
      </section>

      {/* Complete */}
      <section className="todo_section complete">
        <div className="title_box">
          <svg className="title_icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="m10.6 13.8l-2.15-2.15q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"/>
          </svg>
          <h2>Complete</h2>
        </div>

        <ul className={`todo_list ${completeTodos.length === 0 ? "empty" : ""}`}>
          {renderTodoList(completeTodos, "완료된 TODO가 없습니다.")}
        </ul>
      </section>
    </main>
  );
}
