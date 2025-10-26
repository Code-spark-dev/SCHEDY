import React, { useState } from "react";
import "./Header.css";
import { ReactComponent as Logo } from "../assets/logo.svg"; // SVG 컴포넌트 import
import { Link } from "react-router-dom";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  return (
    <header className="header">
      <div className="header_logo">
        <Logo className="logo_img" />
      </div>

      <div className="header_actions">
        {isLoggedIn ? (
          <>
            <Link to="/logout" className="header_logout_btn header_btn btn_style">로그아웃</Link>
            <Link to="/todo" className="header_todo_btn header_btn">TODO 작성</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="header_login_btn header_btn btn_style">로그인</Link>
            <Link to="/login" className="header_todo_btn header_btn"><span>TODO</span> 작성</Link>
          </>
        )}
      </div>
    </header>
  );
}
