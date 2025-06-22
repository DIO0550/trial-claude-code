import { renderHook } from "@testing-library/react";
import { useAutoRedirect } from "./useAutoRedirect";

// Next.js routerのモック
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

describe("useAutoRedirect", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  describe("redirectTo", () => {
    it("正常系：指定したパスにリダイレクトする", () => {
      const { result } = renderHook(() => useAutoRedirect());
      
      result.current.redirectTo("/start");
      
      expect(mockPush).toHaveBeenCalledWith("/start");
    });

    it("正常系：任意のパスにリダイレクトできる", () => {
      const { result } = renderHook(() => useAutoRedirect());
      
      result.current.redirectTo("/game");
      
      expect(mockPush).toHaveBeenCalledWith("/game");
    });

    it("正常系：クエリパラメータ付きのパスにもリダイレクトできる", () => {
      const { result } = renderHook(() => useAutoRedirect());
      
      result.current.redirectTo("/game?cpuLevel=hard&color=white");
      
      expect(mockPush).toHaveBeenCalledWith("/game?cpuLevel=hard&color=white");
    });

    it("境界値：空文字列を指定した場合も処理される", () => {
      const { result } = renderHook(() => useAutoRedirect());
      
      result.current.redirectTo("");
      
      expect(mockPush).toHaveBeenCalledWith("");
    });
  });
});