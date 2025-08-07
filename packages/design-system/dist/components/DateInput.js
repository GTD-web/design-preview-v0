import React, { useState, useRef, useEffect } from "react";
import { useFloating, autoUpdate, offset, flip, shift, arrow, } from "@floating-ui/react";
import { format, parse, isValid } from "date-fns";
import { Input } from "./Input";
import { Calendar } from "./Calendar";
export function DateInput({ value, onChange, minDate, maxDate, disabled = false, placeholder = "날짜를 선택하세요", className = "", label, helperText, error = false, size = "md", variant = "default", }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const arrowRef = useRef(null);
    const inputRef = useRef(null);
    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [
            offset(8),
            flip(),
            shift({ padding: 16 }),
            arrow({ element: arrowRef }),
        ],
        whileElementsMounted: autoUpdate,
    });
    // value가 변경되면 input 값도 업데이트
    useEffect(() => {
        if (value && isValid(value)) {
            setInputValue(format(value, "yyyy. M. d."));
        }
        else {
            setInputValue("");
        }
    }, [value]);
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        // 날짜 파싱 시도
        if (newValue.trim()) {
            try {
                // 다양한 형식 지원
                const formats = [
                    "yyyy. M. d.",
                    "yyyy-MM-dd",
                    "yyyy/MM/dd",
                    "MM/dd/yyyy",
                    "M/d/yyyy",
                    "yyyy.MM.dd",
                    "yyyy.M.d",
                ];
                let parsedDate = null;
                for (const formatStr of formats) {
                    try {
                        const parsed = parse(newValue, formatStr, new Date());
                        if (isValid(parsed)) {
                            parsedDate = parsed;
                            break;
                        }
                    }
                    catch {
                        // 다음 형식으로 시도
                        continue;
                    }
                }
                if (parsedDate && isValid(parsedDate)) {
                    // 날짜 범위 체크
                    if (minDate && parsedDate < minDate)
                        return;
                    if (maxDate && parsedDate > maxDate)
                        return;
                    onChange?.(parsedDate);
                }
            }
            catch {
                // 파싱 실패 시 무시
            }
        }
        else {
            onChange?.(undefined);
        }
    };
    const handleInputClick = () => {
        if (!disabled) {
            setIsOpen(true);
            // input에 포커스를 유지
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };
    const handleInputFocus = () => {
        if (!disabled) {
            setIsOpen(true);
        }
    };
    const handleInputBlur = () => {
        // 포커스 아웃 시 필요한 로직이 있다면 여기에 추가
    };
    const handleCalendarChange = (date) => {
        onChange?.(date);
        setIsOpen(false);
        // 캘린더에서 날짜 선택 후 input에 포커스 유지
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };
    const handleClear = () => {
        setInputValue("");
        onChange?.(undefined);
        // 지우기 후 input에 포커스 유지
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setIsOpen(false);
            inputRef.current?.focus();
        }
        else if (e.key === "Enter") {
            setIsOpen(false);
            inputRef.current?.focus();
        }
        else if (e.key === "ArrowDown" && !isOpen) {
            setIsOpen(true);
            e.preventDefault();
        }
    };
    // 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (refs.floating.current &&
                refs.floating.current instanceof HTMLElement &&
                !refs.floating.current.contains(event.target) &&
                refs.reference.current &&
                refs.reference.current instanceof HTMLElement &&
                !refs.reference.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen, refs.floating, refs.reference]);
    return (React.createElement("div", { className: className },
        React.createElement("div", { ref: refs.setReference },
            React.createElement(Input, { ref: inputRef, value: inputValue, onChange: handleInputChange, onClick: handleInputClick, onFocus: handleInputFocus, onBlur: handleInputBlur, onKeyDown: handleKeyDown, placeholder: placeholder, disabled: disabled, label: label, helperText: helperText, error: error, size: size, variant: variant, clearable: inputValue.length > 0, onClear: handleClear, rightIcon: React.createElement("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" })) })),
        isOpen && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "fixed inset-0 z-40" }),
            React.createElement("div", { ref: refs.setFloating, style: floatingStyles, className: "z-50 bg-white dark:bg-gray-800 border border-border rounded-lg shadow-xl max-w-sm" },
                React.createElement("div", { ref: arrowRef, className: "absolute w-2 h-2 bg-white dark:bg-gray-800 border-l border-t border-border transform rotate-45 -translate-y-1", style: {
                        left: context.middlewareData.arrow?.x,
                        top: -4,
                    } }),
                React.createElement(Calendar, { value: value, onChange: handleCalendarChange, minDate: minDate, maxDate: maxDate, disabled: disabled, className: "border-0 shadow-none bg-transparent p-4" }))))));
}
