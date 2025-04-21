"use client";
import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const textColor = type === "success" ? "#059669" : "#DC2626"; // green-600 or red-600

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center p-4 rounded-lg shadow-lg bg-white">
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke={textColor}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {type === "success" ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          )}
        </svg>
        <span style={{ color: textColor }}>{message}</span>
      </div>
    </div>
  );
};

export default Toast; 