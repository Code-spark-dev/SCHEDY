import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as HideIcon } from "../assets/password_hide.svg";
import { ReactComponent as ShowIcon } from "../assets/password_show.svg";
import CustomModal from "../components/Modal"; // Modal 컴포넌트 가져오기
import "../styles/Join.css";
import axios from "axios";

export default function Join() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [idError, setIdError] = useState(""); // 아이디 에러 메시지
  const [nameError, setNameError] = useState(""); // 이름 에러 메시지
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 에러 메시지
  const [modalMessage, setModalMessage] = useState(""); // 모달 메시지 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 추가
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (idError || nameError || passwordError) {
      setModalMessage("입력값을 확인해주세요."); // 에러 메시지 설정
      setIsModalOpen(true); // 모달 열기
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", {
        username: email,
        password,
        name,
      });

      if (res.status === 200) {
        setModalMessage("회원가입이 완료되었습니다!");
        setIsModalOpen(true);
        setTimeout(() => navigate("/login"), 2000); // 2초 후 로그인 페이지로 이동
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data.message) {
        setModalMessage(err.response.data.message); // 에러 메시지 설정
      } else {
        setModalMessage(`회원가입 실패: ${err.message}`);
      }
      setIsModalOpen(true); // 모달 열기
    }
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

      {/* CustomModal 사용 */}
      <CustomModal isOpen={isModalOpen} message={modalMessage} onClose={() => setIsModalOpen(false)}/>
    </div>
  );
}
