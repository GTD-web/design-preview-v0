import React, { forwardRef, InputHTMLAttributes } from "react";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "outlined";
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  helperText?: string;
  clearable?: boolean | "icon" | "button" | "text";
  clearText?: string;
  onClear?: () => void;
}

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-4 py-3 text-base",
};

const variantClasses = {
  default: "border border-border bg-surface focus:border-primary",
  filled: "border-0 bg-gray-100 focus:bg-white",
  outlined: "border-2 border-border bg-transparent focus:border-primary",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      variant = "default",
      error = false,
      leftIcon,
      rightIcon,
      label,
      helperText,
      clearable = false,
      clearText = "지우기",
      onClear,
      className = "",
      value,
      ...props
    },
    ref
  ) => {
    const hasValue = value && String(value).length > 0;
    const showClearButton = clearable && hasValue;
    const clearType = typeof clearable === "string" ? clearable : "icon";

    // 아이콘이 있을 때 padding 조정
    const getInputPadding = () => {
      if (leftIcon && (rightIcon || showClearButton)) {
        return "pl-10 pr-10 py-2 text-sm"; // 양쪽 아이콘
      } else if (leftIcon) {
        return "pl-10 pr-4 py-2 text-sm"; // 왼쪽 아이콘만
      } else if (rightIcon || showClearButton) {
        return "pl-4 pr-10 py-2 text-sm"; // 오른쪽 아이콘만
      } else {
        return sizeClasses[size]; // 아이콘 없음
      }
    };

    const inputClasses = [
      "w-full rounded-lg transition-all duration-200 focus:outline-none",
      getInputPadding(),
      variantClasses[variant],
      error && "border-danger focus:border-danger",
    ]
      .filter(Boolean)
      .join(" ");

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onClear) {
        onClear();
      }
    };

    // 지우기 버튼 렌더링
    const renderClearButton = () => {
      if (!showClearButton) return null;

      switch (clearType) {
        case "icon":
          return (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer z-10"
              aria-label="지우기"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          );

        case "button":
          return (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors cursor-pointer z-10"
              aria-label="지우기"
            >
              {clearText}
            </button>
          );

        case "text":
          return (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer z-10 text-sm underline"
              aria-label="지우기"
            >
              {clearText}
            </button>
          );

        default:
          return null;
      }
    };

    const InputElement = (
      <div className={`relative ${className}`}>
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            {leftIcon}
          </div>
        )}
        <input ref={ref} className={inputClasses} value={value} {...props} />
        {renderClearButton()}
        {rightIcon && !showClearButton && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            {rightIcon}
          </div>
        )}
      </div>
    );

    if (label || helperText) {
      return (
        <div className="w-full">
          {label && (
            <label className="block text-sm font-medium mb-1 text-foreground">
              {label}
            </label>
          )}
          {InputElement}
          {helperText && (
            <p
              className={`mt-1 text-xs ${
                error ? "text-danger" : "text-gray-500"
              }`}
            >
              {helperText}
            </p>
          )}
        </div>
      );
    }

    return InputElement;
  }
);

// 컴포넌트 이름 지정
Input.displayName = "Input";
