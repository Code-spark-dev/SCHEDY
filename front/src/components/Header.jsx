import React from "react";
import "./Header.css";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header({ onOpenTodoModal, onResetTodos }) {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    logout();
    if (onResetTodos) {
      onResetTodos();
    }
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header_logo">
        <Logo className="logo_img" />
      </div>

      <div className="header_actions">
        {isLoggedIn ? (
          <>
            <button onClick={handleLogoutClick} className="header_logout_btn header_btn btn_style">로그아웃</button>
            <button onClick={onOpenTodoModal} className="header_todo_btn header_btn">TODO 작성</button>
          </>
        ) : (
          <>
            <button onClick={handleLoginClick} className="header_login_btn header_btn btn_style">로그인</button>
            <button onClick={handleLoginClick} className="header_todo_btn header_btn"><span>TODO</span> 작성</button>
          </>
        )}
      </div>
    </header>
  );
}
