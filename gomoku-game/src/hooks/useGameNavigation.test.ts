import { renderHook } from "@testing-library/react";
import { useGameNavigation } from "./useGameNavigation";

// Next.js routerのモック
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

describe("useGameNavigation", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  describe("navigateToGame", () => {
    it("正常系：CPU難易度と石の色を指定してゲーム画面に遷移する", () => {
      const { result } = renderHook(() => useGameNavigation());
      
      result.current.navigateToGame("normal", "black");
      
      expect(mockPush).toHaveBeenCalledWith("/game?cpuLevel=normal&color=black");
    });

    it("正常系：白石を選択してゲーム画面に遷移する", () => {
      const { result } = renderHook(() => useGameNavigation());
      
      result.current.navigateToGame("hard", "white");
      
      expect(mockPush).toHaveBeenCalledWith("/game?cpuLevel=hard&color=white");
    });

    it("境界値：nullの色を指定した場合、blackがデフォルトで設定される", () => {
      const { result } = renderHook(() => useGameNavigation());
      
      result.current.navigateToGame("easy", null);
      
      expect(mockPush).toHaveBeenCalledWith("/game?cpuLevel=easy&color=black");
    });

    it("正常系：すべてのCPU難易度で動作する", () => {
      const { result } = renderHook(() => useGameNavigation());
      
      const levels = ["easy", "normal", "hard"] as const;
      
      levels.forEach(level => {
        result.current.navigateToGame(level, "black");
        expect(mockPush).toHaveBeenCalledWith(`/game?cpuLevel=${level}&color=black`);
      });
    });
  });
});