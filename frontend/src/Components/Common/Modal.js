import React from "react";
import "./Modal.css";

const Modal = ({
  title,
  children,
  canCancel,
  canConfirm,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="modal">
      <header className="modal-header">
        <h1>{title}</h1>
      </header>
      <section className="modal-content">{children}</section>
      <section className="modal-actions">
        {canCancel && (
          <button className="btn-modal" onClick={onCancel}>
            Cancel
          </button>
        )}
        {canConfirm && (
          <button className="btn-modal" onClick={onConfirm}>
            Confirm
          </button>
        )}
      </section>
    </div>
  );
};
export default Modal;
