import { JSX, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "small" | "medium" | "large";

type Props = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconOnly?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>

/**
 * 汎用的なボタンコンポーネント
 * 
 * @param variant - ボタンの見た目バリアント（primary: 青、secondary: グレー）
 * @param size - ボタンのサイズ（small, medium, large）
 * @param fullWidth - 幅を100%にするかどうか
 * @param children - ボタン内に表示するコンテンツ
 * @param icon - 表示するアイコン
 * @param iconOnly - アイコンのみ表示するかどうか
 * @param className - 追加のCSSクラス
 * @param props - その他のHTMLButtonElement属性
 * @returns ボタンコンポーネント
 */
const Button = ({
  variant = "primary",
  size = "medium",
  fullWidth = false,
  children,
  icon,
  iconOnly = false,
  className = "",
  ...props
}: Props): JSX.Element => {
  const baseClasses = "font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 border border-gray-300",
  };

  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={combinedClasses} {...props}>
      {icon && icon}
      {!iconOnly && children}
    </button>
  );
};

export default Button;