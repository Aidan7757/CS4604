import React from "react";
import "./ActionButton.css";

export default function ActionButton({
  label,
  onClick,
  disabled,
  variant = "primary",
}) {
  return (
    <button
      className={`action-button action-button--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
