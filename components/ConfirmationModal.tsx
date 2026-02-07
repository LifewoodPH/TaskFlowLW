import React, { useState, useEffect, useRef } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel'
}) => {
  const [show, setShow] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Trigger animation frame
      const timer = setTimeout(() => setShow(true), 10);

      // Accessibility: Focus the cancel button to prevent accidental confirmation via Enter key
      const focusTimer = setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 50);

      // Accessibility: Close on Escape key
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        clearTimeout(focusTimer);
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      setShow(false);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center p-4 transition-all duration-300 ${show ? 'visible' : 'invisible'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Backdrop with click handler */}
      <div
        className={`absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-xl transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={`bg-white/80 dark:bg-slate-900/90 backdrop-blur-3xl rounded-[32px] border border-black/10 dark:border-white/10 shadow-2xl w-full max-w-md p-8 relative z-10 transition-all duration-300 transform ${show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
      >
        <h2 id="modal-title" className="text-2xl font-black mb-4 text-slate-900 dark:text-white uppercase tracking-tight">
          {title}
        </h2>
        <p id="modal-description" className="text-sm font-bold text-slate-400 dark:text-slate-300 mb-8 leading-relaxed uppercase tracking-wider">
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            ref={cancelButtonRef}
            onClick={onClose}
            className="px-6 py-3 bg-black/5 dark:bg-white/5 text-slate-400 dark:text-slate-400 rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all text-[10px] font-black uppercase tracking-widest focus:outline-none"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-400 transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;