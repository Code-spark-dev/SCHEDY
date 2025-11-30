import React, { useEffect } from "react";
import "./Notification.css";
import { ReactComponent as Noti } from "../assets/notification.svg";

export default function Notification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // 3초 후 알림 닫기
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="notification">
      <Noti className="noti_img" />
      <p>{message}</p>
    </div>
  );
}

