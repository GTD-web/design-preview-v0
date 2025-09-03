import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { HStack } from "./Stack";
export function Select({ selectSize = "md", variant = "default", options, value, onChange, className = "", label, error, helperText, width, ...props }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options.find((option) => option.value === value));
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
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
    const baseClasses = "border rounded transition-all duration-200 focus:outline-none";
    const sizeClasses = {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-2 text-sm",
        lg: "px-4 py-3 text-base",
    };
    const variantClasses = {
        default: "bg-surface text-foreground",
        outline: "bg-transparent text-foreground",
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
    const handleSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        onChange?.(option.value);
    };
    // 체크 아이콘 컴포넌트
    const CheckIcon = () => (React.createElement("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" })));
    return (React.createElement("div", { className: `${width ? "" : "w-full"}`, style: { width: width }, ref: dropdownRef },
        label && (React.createElement(HStack, { justify: "between" },
            React.createElement("label", { className: "text-sm font-medium text-foreground whitespace-nowrap" }, label),
            React.createElement("div", { className: "relative", style: { width: "160px" } },
                React.createElement("button", { type: "button", className: buttonClasses, onClick: () => setIsOpen(!isOpen), ...props },
                    React.createElement("span", { className: "truncate" }, selectedOption?.label || "선택하세요"),
                    React.createElement("svg", { className: `w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" }))),
                isOpen && (React.createElement("div", { className: "absolute z-50 w-full mt-1 bg-surface border rounded-md shadow-lg" },
                    React.createElement("div", { className: "py-1 max-h-60 overflow-auto" }, options.map((option) => (React.createElement("button", { key: option.value, type: "button", className: `w-full text-left px-3 py-2 text-sm hover:bg-primary/5 flex items-center justify-between ${selectedOption?.value === option.value
                            ? "bg-primary/10 text-primary"
                            : "text-foreground"}`, onClick: () => handleSelect(option) },
                        React.createElement("span", null, option.label),
                        selectedOption?.value === option.value && React.createElement(CheckIcon, null)))))))))),
        !label && (React.createElement("div", { className: "relative" },
            React.createElement("button", { type: "button", className: buttonClasses, onClick: () => setIsOpen(!isOpen), ...props },
                React.createElement("span", { className: "truncate" }, selectedOption?.label || "선택하세요"),
                React.createElement("svg", { className: `w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" }))),
            isOpen && (React.createElement("div", { className: "absolute z-50 w-full mt-1 bg-surface border rounded-md shadow-lg" },
                React.createElement("div", { className: "py-1 max-h-60 overflow-auto" }, options.map((option) => (React.createElement("button", { key: option.value, type: "button", className: `w-full text-left px-3 py-2 text-sm hover:bg-primary/5 flex items-center justify-between ${selectedOption?.value === option.value
                        ? "bg-primary/10 text-primary"
                        : "text-foreground"}`, onClick: () => handleSelect(option) },
                    React.createElement("span", null, option.label),
                    selectedOption?.value === option.value && React.createElement(CheckIcon, null))))))))),
        error && React.createElement("p", { className: "mt-xs text-xs text-danger" }, error),
        helperText && !error && (React.createElement("p", { className: "mt-xs text-xs text-gray-600" }, helperText))));
}
