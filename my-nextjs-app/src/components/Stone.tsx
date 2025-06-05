import { JSX } from "react";
import { StoneColor } from "../types/stone";

interface StoneProps {
  color: StoneColor;
}

const Stone = ({ color }: StoneProps): JSX.Element => {
  if (!color) {
    return <div className="stone stone-empty" />;
  }

  return (
    <div
      className={`stone stone-${color}`}
      role="img"
      aria-label={`${color} stone`}
    >
      <div className="stone-inner" />
    </div>
  );
};

export default Stone;
