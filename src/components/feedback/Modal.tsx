import React from 'react';
import { Dialog } from '@base-ui/react/dialog';

export interface ModalProps {
  title?: React.ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  open?: boolean;
  style?: React.CSSProperties;
}

// Built on Base UI's Dialog, from shadcn/ui's Base UI dialog (DD-034). Base UI moves focus into
// the dialog, keeps it there, closes on Escape and on a click outside the box, and gives focus
// back to the element that had it. Bob keeps its props: the parent owns `open`, and every way
// of closing calls `onClose`.
export function Modal({ title, onClose, children, footer, open = true, style }: ModalProps) {
  const boxRef = React.useRef<HTMLDivElement>(null);
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose?.()}>
      <Dialog.Portal>
        {/* The viewport is Bob's backdrop: it dims the screen and places the box. A click on
            it is a click outside the box, so it closes the dialog. */}
        <Dialog.Viewport className="modal">
          {/* Focus goes to the box itself, so the first Tab reaches the × button. */}
          <Dialog.Popup ref={boxRef} initialFocus={boxRef} className="modal-box" style={style} aria-modal="true">
            <div className="modal-header">
              <Dialog.Title className="modal-title">{title}</Dialog.Title>
              <Dialog.Close className="modal-close" aria-label="Close">
                &times;
              </Dialog.Close>
            </div>
            {children}
            {footer && <div className="modal-footer">{footer}</div>}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
