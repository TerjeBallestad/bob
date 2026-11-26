import React from 'react';

export interface ModalProps {
  title?: React.ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  open?: boolean;
  style?: React.CSSProperties;
}

export function Modal({ title, onClose, children, footer, open = true, style }: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="modal"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div className="modal-box" style={style}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
