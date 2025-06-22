import { renderHook } from "@testing-library/react";
import { useBackToStart } from "./useBackToStart";

// Next.js routerのモック
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

describe("useBackToStart", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  describe("backToStart", () => {
    it("正常系：スタート画面に遷移する", () => {
      const { result } = renderHook(() => useBackToStart());
      
      result.current.backToStart();
      
      expect(mockPush).toHaveBeenCalledWith("/start");
    });

    it("正常系：複数回呼び出しても正常に動作する", () => {
      const { result } = renderHook(() => useBackToStart());
      
      result.current.backToStart();
      result.current.backToStart();
      
      expect(mockPush).toHaveBeenCalledTimes(2);
      expect(mockPush).toHaveBeenNthCalledWith(1, "/start");
      expect(mockPush).toHaveBeenNthCalledWith(2, "/start");
    });
  });
});