"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

type UseAutoRedirectReturn = {
  redirectTo: (targetPath: string) => void;
};

/**
 * 自動リダイレクト処理を管理するフック
 * ホーム画面からスタート画面への自動リダイレクトに使用
 */
export function useAutoRedirect(): UseAutoRedirectReturn {
  const router = useRouter();

  /**
   * 指定したパスへの自動リダイレクト
   * @param targetPath リダイレクト先のパス
   */
  const redirectTo = useCallback((targetPath: string) => {
    router.push(targetPath);
  }, [router]);

  return {
    redirectTo
  };
}