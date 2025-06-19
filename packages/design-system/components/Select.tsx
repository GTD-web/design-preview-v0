import * as React from "react";
import { ButtonHTMLAttributes, ReactNode, useState, useRef, useEffect } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size" | "value" | "onChange"> {
  selectSize?: "sm" | "md" | "lg";
  variant?: "default" | "outline";
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  width?: string | number;
}

export function Select({
  selectSize = "md",
  variant = "default",
  options,
  value,
  onChange,
  className = "",
  label,
  error,
  helperText,
  width,
  ...props
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | undefined>(options.find((option) => option.value === value));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const newSelectedOption = options.find((option) => option.value === value);
    setSelectedOption(newSelectedOption);
  }, [value, options]);

  const baseClasses = "border rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20";

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  const variantClasses = {
    default: "border-border bg-surface text-foreground",
    outline: "border-border bg-transparent text-foreground",
  };

  const buttonClasses = [
    baseClasses,
    sizeClasses[selectSize],
    variantClasses[variant],
    error && "border-danger focus:ring-danger/20",
    "w-full text-left flex justify-between items-center cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleSelect = (option: SelectOption) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange?.(option.value);
  };

  return (
    <div className={`${width ? "" : "w-full"}`} style={{ width: width }} ref={dropdownRef}>
      {label && (
        <div className="w-full flex items-center justify-between mb-sm">
          <label className="text-sm font-medium text-foreground whitespace-nowrap">{label}</label>
          <div className="relative" style={{ width: "160px" }}>
            <button type="button" className={buttonClasses} onClick={() => setIsOpen(!isOpen)} {...props}>
              <span className="truncate">{selectedOption?.label || "선택하세요"}</span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div className="absolute z-50 w-full mt-1 bg-surface border border-border rounded-md shadow-lg">
                <div className="py-1 max-h-60 overflow-auto">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-primary/5 ${
                        selectedOption?.value === option.value ? "bg-primary/10 text-primary" : "text-foreground"
                      }`}
                      onClick={() => handleSelect(option)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {!label && (
        <div className="relative">
          <button type="button" className={buttonClasses} onClick={() => setIsOpen(!isOpen)} {...props}>
            <span className="truncate">{selectedOption?.label || "선택하세요"}</span>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-surface border border-border rounded-md shadow-lg">
              <div className="py-1 max-h-60 overflow-auto">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-primary/5 ${
                      selectedOption?.value === option.value ? "bg-primary/10 text-primary" : "text-foreground"
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {error && <p className="mt-xs text-xs text-danger">{error}</p>}
      {helperText && !error && <p className="mt-xs text-xs text-gray-600">{helperText}</p>}
    </div>
  );
}
