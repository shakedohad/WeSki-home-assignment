import React from "react";
import "./rating.scss";

interface Props {
  value: number;
  max?: number;
}

const Rating: React.FC<Props> = ({ value, max = 5 }) => {
  const normalizedValue = Math.max(0, Math.min(max, Math.round(value)));

  return (
    <div className="rating" aria-label={`Rating: ${normalizedValue} out of ${max}`}>
      {Array.from({ length: max }).map((_, index) => (
        <span
          key={index}
          className={`rating-star${index < normalizedValue ? "" : " rating-star-empty"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default Rating;
