import React from "react";
import Modal from "react-modal";
import "./Modal.css";

// react-modal 초기화
Modal.setAppElement("#root");

export default function CustomModal({ isOpen, message, onClose }) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal" overlayClassName="modal_overlay">
      <p>{message}</p>
      <button onClick={onClose}>확인</button>
    </Modal>
  );
}
