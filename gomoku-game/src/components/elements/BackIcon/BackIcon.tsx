import { JSX } from "react";

type BackIconSize = "small" | "medium" | "large";

type Props = {
  size?: BackIconSize;
  className?: string;
};

/**
 * 戻るアイコンコンポーネント
 * 
 * @param size - アイコンのサイズ（small, medium, large）
 * @param className - 追加のCSSクラス
 * @returns 戻るアイコンコンポーネント
 */
const BackIcon = ({ size = "medium", className = "" }: Props): JSX.Element => {
  const sizeClasses = {
    small: "text-sm",
    medium: "text-lg",
    large: "text-xl",
  };

  const combinedClasses = [
    "inline-flex items-center justify-center",
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span 
      className={combinedClasses}
      aria-label="戻る"
    >
      &lt;
    </span>
  );
};

export default BackIcon;