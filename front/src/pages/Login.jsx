import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as HideIcon } from "../assets/password_hide.svg";
import { ReactComponent as ShowIcon } from "../assets/password_show.svg";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login",
        {username:email,password},
        {withCredentials:true}
      );

      if (res.status === 200) {
        login();
        alert("로그인 성공!");
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("로그인 실패! 서버를 확인해주세요.");
      }
    }
  };

  const handleSignup = () => {
    navigate("/join");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login_page">
      <h2><Logo className="logo_img" /></h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="아이디를 입력해주세요" value={email} onChange={(e) => setEmail(e.target.value)} required/>

        <div className="password_wrapper">
          <input type={showPassword ? "text" : "password"} placeholder="비밀번호를 입력해주세요" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          {/* 비밀번호 상태에 따라 아이콘 변경 */}
          {showPassword ? (
            <ShowIcon className="password_icon" onClick={togglePasswordVisibility} />
          ) : (
            <HideIcon className="password_icon" onClick={togglePasswordVisibility} />
          )}
        </div>

        <button type="submit" className="login">로그인</button>
        <button type="button" className="join" onClick={handleSignup}>회원가입</button>
      </form>
    </div>
  );
}
