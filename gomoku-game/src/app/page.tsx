"use client";

import { useEffect } from "react";
import { useAutoRedirect } from "@/hooks/useAutoRedirect";

export default function Home() {
  const { redirectTo } = useAutoRedirect();

  useEffect(() => {
    redirectTo("/start");
  }, [redirectTo]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">五目並べを読み込み中...</p>
      </div>
    </div>
  );
}
