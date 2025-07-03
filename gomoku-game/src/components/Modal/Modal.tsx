import React, { ReactNode, useEffect, useRef } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

/**
 * 汎用モーダルダイアログコンポーネント
 * オーバーレイ、フォーカス管理、ESCキー対応を提供する
 */
export const Modal = ({ isOpen, onClose, children }: Props): React.JSX.Element => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // フォーカス管理: モーダル内の最初のフォーカス可能要素にフォーカスを設定
      if (modalRef.current) {
        const focusableElement = modalRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        focusableElement?.focus();
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return <></>;
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      data-testid="modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="relative max-h-[90vh] max-w-lg overflow-auto rounded-lg bg-white p-6 shadow-xl"
      >
        {children}
      </div>
    </div>
  );
};
