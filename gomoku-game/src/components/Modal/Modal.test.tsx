import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  test("isOpenがtrueの時にモーダルが表示される", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>モーダルコンテンツ</div>
      </Modal>
    );

    expect(screen.getByText("モーダルコンテンツ")).toBeInTheDocument();
  });

  test("isOpenがfalseの時にモーダルが表示されない", () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>モーダルコンテンツ</div>
      </Modal>
    );

    expect(screen.queryByText("モーダルコンテンツ")).not.toBeInTheDocument();
  });

  test("オーバーレイをクリックするとonCloseが呼ばれる", () => {
    const mockOnClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>モーダルコンテンツ</div>
      </Modal>
    );

    const overlay = screen.getByTestId("modal-overlay");
    fireEvent.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("モーダルコンテンツをクリックしてもonCloseが呼ばれない", () => {
    const mockOnClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>モーダルコンテンツ</div>
      </Modal>
    );

    const content = screen.getByText("モーダルコンテンツ");
    fireEvent.click(content);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("Escapeキーを押すとonCloseが呼ばれる", () => {
    const mockOnClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>モーダルコンテンツ</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("適切なARIA属性が設定されている", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>モーダルコンテンツ</div>
      </Modal>
    );

    const modal = screen.getByRole("dialog");
    expect(modal).toHaveAttribute("aria-modal", "true");
  });

  test("フォーカスがモーダル内に移動する", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>
          <button>ボタン1</button>
          <button>ボタン2</button>
        </div>
      </Modal>
    );

    const firstButton = screen.getByText("ボタン1");
    expect(document.activeElement).toBe(firstButton);
  });
});
