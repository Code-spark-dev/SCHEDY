import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as HideIcon } from "../assets/password_hide.svg";
import { ReactComponent as ShowIcon } from "../assets/password_show.svg";
import "../styles/Join.css";

export default function Join() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [idError, setIdError] = useState(""); // 아이디 에러 메시지
  const [nameError, setNameError] = useState(""); // 이름 에러 메시지
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 에러 메시지
  const navigate = useNavigate();

  // 사용할 수 없는 아이디 체크
  const validateId = (value) => {
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    const specialCharRegex = /[^a-zA-Z0-9]/;
    const existingIds = ["test", "admin", "user"];
    if (koreanRegex.test(value) || specialCharRegex.test(value) || existingIds.includes(value)) {
      setIdError("※ 사용할 수 없는 아이디입니다. 다른 아이디를 입력해주세요.");
    } else {
      setIdError("");
    }
  };
  const handleIdChange = (e) => {
    setEmail(e.target.value);
    validateId(e.target.value);
  };

  // 이름 유효성 검사 (한글/영문 + 공백 허용)
  const validateName = (value) => {
    const nameRegex = /^[a-zA-Z가-힣\s]+$/; // 공백(\s) 허용
    if (!nameRegex.test(value)) {
      setNameError("※ 사용할 수 없는 이름입니다. 다른 이름을 입력해주세요. (한글, 영문 및 공백만 입력)");
    } else {
      setNameError("");
    }
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
    validateName(e.target.value);
  };

  // 비밀번호 유효성 검사 (한글 입력 불가)
  const validatePassword = (value) => {
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if (koreanRegex.test(value)) {
      setPasswordError("※ 한글은 입력할 수 없습니다. 영어와 숫자, 특수문자를 입력해주세요.");
    } else {
      setPasswordError("");
    }
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    validatePassword(e.target.value);
  };

  // 비밀번호 표시/숨기기 토글
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // 폼 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    if (idError) {
      alert("아이디를 올바르게 입력해주세요.");
      return;
    }
    if (nameError) {
      alert("이름을 올바르게 입력해주세요.");
      return;
    }
    if (passwordError) {
      alert("비밀번호를 올바르게 입력해주세요.");
      return;
    }
    console.log({ email, password, name });
    alert("회원가입이 완료되었습니다.");
    navigate("/login"); // 가입 후 로그인 화면으로 이동
  };

  return (
    <div className="join_page">
      <h2><Logo className="logo_img" /></h2>
      <form onSubmit={handleSubmit}>
        <div className="input_wrapper">
          <input type="text" placeholder="사용하실 아이디를 입력해주세요" value={email} onChange={handleIdChange} className={idError ? "input_error" : ""} required/>
          {idError && <p className="error_text">{idError}</p>}
        </div>

        <div className={`password_wrapper ${passwordError ? "error" : ""}`}>
          <input type={showPassword ? "text" : "password"} placeholder="사용하실 비밀번호를 입력해주세요" value={password} onChange={handlePasswordChange} className={passwordError ? "input_error" : ""} required/>
          {showPassword ? (
            <ShowIcon className="password_icon" onClick={togglePasswordVisibility} />
          ) : (
            <HideIcon className="password_icon" onClick={togglePasswordVisibility} />
          )}
          {passwordError && <p className="error_text">{passwordError}</p>}
        </div>

        <div className="input_wrapper">
          <input type="text" placeholder="이름을 입력해주세요" value={name} onChange={handleNameChange} className={nameError ? "input_error" : ""} required/>
          {nameError && <p className="error_text">{nameError}</p>}
        </div>

        <button type="submit" className="join">회원가입</button>
      </form>
    </div>
  );
}
