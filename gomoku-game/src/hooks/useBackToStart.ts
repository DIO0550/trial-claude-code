"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

type UseBackToStartReturn = {
  backToStart: () => void;
};

/**
 * スタート画面への戻る処理を管理するフック
 */
export function useBackToStart(): UseBackToStartReturn {
  const router = useRouter();

  /**
   * スタート画面への遷移
   */
  const backToStart = useCallback(() => {
    router.push("/start");
  }, [router]);

  return {
    backToStart
  };
}