// src/pages/Home.js

import React, { useState, useEffect, useLayoutEffect } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import axios from "axios";
import "../styles/Home.css";
import TodoItem from "../components/TodoItem";

export default function Home() {
  const [plannedTodos, setPlannedTodos] = useState([]);
  const [ongoingTodos, setOngoingTodos] = useState([]);
  const [completeTodos, setCompleteTodos] = useState([]);

  // ✅ 1. 투두 불러오기
  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/todo");
      setPlannedTodos(res.data.planned || []);
      setOngoingTodos(res.data.ongoing || []);
      setCompleteTodos(res.data.complete || []);
    } catch (err) {
      console.error("❌ 서버 연결 실패:", err);
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/todo");
        setPlannedTodos(res.data.planned || []);
        setOngoingTodos(res.data.ongoing || []);
        setCompleteTodos(res.data.complete || []);
      } catch (err) {
        console.error("백엔드 서버 연결 실패:", err);
      }
    };
    fetchTodos();
  }, []);

  // ✅ 2. 삭제 기능
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/todo/${id}`);
      console.log("🗑️ 삭제 완료:", id);
      fetchTodos(); // 삭제 후 목록 새로고침
    } catch (err) {
      console.error("❌ 삭제 실패:", err);
    }
  };

  // 드래그앤드롭
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // 같은 리스트 내 이동
    if (source.droppableId === destination.droppableId) {
      const listMap = {
        planned: [...plannedTodos],
        ongoing: [...ongoingTodos],
        complete: [...completeTodos],
      };

      const items = listMap[source.droppableId];
      const [movedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, movedItem);

      if (source.droppableId === "planned") setPlannedTodos(items);
      if (source.droppableId === "ongoing") setOngoingTodos(items);
      if (source.droppableId === "complete") setCompleteTodos(items);
      return;
    }

    const sourceList = {
      planned: [...plannedTodos],
      ongoing: [...ongoingTodos],
      complete: [...completeTodos],
    }[source.droppableId];

    const destList = {
      planned: [...plannedTodos],
      ongoing: [...ongoingTodos],
      complete: [...completeTodos],
    }[destination.droppableId];

    // 원래 리스트에서 제거 후, 새 리스트에 삽입
    const [movedItem] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, movedItem);

    // 상태 갱신
    if (source.droppableId === "planned") setPlannedTodos(sourceList);
    if (source.droppableId === "ongoing") setOngoingTodos(sourceList);
    if (source.droppableId === "complete") setCompleteTodos(sourceList);

    if (destination.droppableId === "planned") setPlannedTodos(destList);
    if (destination.droppableId === "ongoing") setOngoingTodos(destList);
    if (destination.droppableId === "complete") setCompleteTodos(destList);
  };

  // 스크롤바 감지
  useLayoutEffect(() => {
    const scrollBoxes = document.querySelectorAll(".todo_list");
    scrollBoxes.forEach(box => {
      const hasScroll = box.scrollHeight > box.clientHeight;
      const parentBox = box.parentElement;
      if (hasScroll) {
        box.classList.add("has-scroll");
        parentBox.classList.add("has-scroll");
      } else {
        box.classList.remove("has-scroll");
        parentBox.classList.remove("has-scroll");
      }
    });
  }, [plannedTodos, ongoingTodos, completeTodos]);

  const renderTodoList = (todos, droppableId, emptyMsg) => (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <ul className="todo_list" ref={provided.innerRef} {...provided.droppableProps}>
          {todos.length === 0 ? (
            <li className="empty_msg">{emptyMsg}</li>
          ) : (
            todos.map((todo, idx) => (
              <TodoItem
                key={idx}
                todo={todo}
                index={idx}
                droppableId={droppableId}
                onEdit={() => console.log("edit", todo)}
                 onDelete={() => handleDelete(todo._id)}
              />
            ))
          )}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );

  return (
    <main className="home">
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Planned */}
        <section className="todo_section planned">
          <div className="title_box">
            <svg className="title_icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M10 19q-.425 0-.712-.288T9 18t.288-.712T10 17h10q.425 0 .713.288T21 18t-.288.713T20 19zm0-6q-.425 0-.712-.288T9 12t.288-.712T10 11h10q.425 0 .713.288T21 12t-.288.713T20 13zm0-6q-.425 0-.712-.288T9 6t.288-.712T10 5h10q.425 0 .713.288T21 6t-.288.713T20 7zM5 20q-.825 0-1.412-.587T3 18t.588-1.412T5 16t1.413.588T7 18t-.587 1.413T5 20m0-6q-.825 0-1.412-.587T3 12t.588-1.412T5 10t1.413.588T7 12t-.587 1.413T5 14m0-6q-.825 0-1.412-.587T3 6t.588-1.412T5 4t1.413.588T7 6t-.587 1.413T5 8"/>
          </svg>
            <h2>Planned</h2>
          </div>
          <div className="scroll_box">
            {renderTodoList(plannedTodos, "planned", "TODO를 추가해주세요.")}
          </div>
        </section>

        {/* Ongoing */}
        <section className="todo_section ongoing">
          <div className="title_box">
            <svg className="title_icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="m13 12.175l2.25 2.25q.275.275.275.688t-.275.712q-.3.3-.712.3t-.713-.3L11.3 13.3q-.15-.15-.225-.337T11 12.575V9q0-.425.288-.712T12 8t.713.288T13 9zM12 6q-.425 0-.712-.288T11 5V4h2v1q0 .425-.288.713T12 6m6 6q0-.425.288-.712T19 11h1v2h-1q-.425 0-.712-.288T18 12m-6 6q.425 0 .713.288T13 19v1h-2v-1q0-.425.288-.712T12 18m-6-6q0 .425-.288.713T5 13H4v-2h1q.425 0 .713.288T6 12m6 10q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m8-10q0-3.35-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20t5.675-2.325T20 12m-8 0"/>
          </svg>
            <h2>Ongoing</h2>
          </div>
          <div className="scroll_box">
            {renderTodoList(ongoingTodos, "ongoing", "진행중인 TODO가 없습니다.")}
          </div>
        </section>

        {/* Complete */}
        <section className="todo_section complete">
          <div className="title_box">
            <svg className="title_icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="m10.6 13.8l-2.15-2.15q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"/>
          </svg>
            <h2>Complete</h2>
          </div>
          <div className="scroll_box">
            {renderTodoList(completeTodos, "complete", "완료된 TODO가 없습니다.")}
          </div>
        </section>
      </DragDropContext>
    </main>
  );
}