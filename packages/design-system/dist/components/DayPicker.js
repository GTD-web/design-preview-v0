import React, { useState, useRef, useEffect } from "react";
import { useFloating, autoUpdate, offset, flip, shift, arrow, } from "@floating-ui/react";
import { format, parse, isValid, startOfMonth, endOfMonth, addMonths, subMonths, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, isToday, isBefore, isAfter, } from "date-fns";
import { ko } from "date-fns/locale";
import { Input } from "./Input";
export function DayPicker({ value, onChange, minDate, maxDate, disabled = false, placeholder = "날짜를 선택하세요", className = "", label, helperText, error = false, size = "md", variant = "default", }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isDarkMode, setIsDarkMode] = useState(false);
    const arrowRef = useRef(null);
    const inputRef = useRef(null);
    // 다크모드 상태 감지
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        };
        checkDarkMode();
        // 테마 변경 감지를 위한 observer
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);
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
    // value가 변경되면 input 값과 currentMonth 업데이트 (최적화된 버전)
    useEffect(() => {
        if (value && isValid(value)) {
            const formattedValue = format(value, "yyyy. MM. dd", { locale: ko });
            // 불필요한 업데이트 방지: 현재 inputValue와 다를 때만 업데이트
            setInputValue((prev) => prev !== formattedValue ? formattedValue : prev);
            setCurrentMonth((prev) => (!isSameMonth(prev, value) ? value : prev));
        }
        else {
            setInputValue((prev) => (prev !== "" ? "" : prev));
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
                    "yyyy. MM. dd",
                    "yyyy.MM.dd",
                    "yyyy-MM-dd",
                    "yyyy/MM/dd",
                    "MM/dd/yyyy",
                    "M/d/yyyy",
                    "yyyy.M.d",
                    "yyyy. M. d",
                ];
                let parsedDate = null;
                for (const formatStr of formats) {
                    try {
                        const parsed = parse(newValue, formatStr, new Date(), {
                            locale: ko,
                        });
                        if (isValid(parsed)) {
                            parsedDate = parsed;
                            break;
                        }
                    }
                    catch {
                        continue;
                    }
                }
                if (parsedDate && isValid(parsedDate)) {
                    // 날짜 범위 체크
                    if (minDate && isBefore(parsedDate, minDate))
                        return;
                    if (maxDate && isAfter(parsedDate, maxDate))
                        return;
                    onChange?.(parsedDate);
                    setCurrentMonth(parsedDate);
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
    const handleDayClick = (date) => {
        if (onChange) {
            onChange(date);
        }
        setIsOpen(false);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };
    const handleClear = () => {
        setInputValue("");
        onChange?.(undefined);
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
    // 캘린더 날짜 생성
    const generateCalendarDays = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const startDate = startOfWeek(monthStart, { locale: ko });
        const endDate = endOfWeek(monthEnd, { locale: ko });
        const days = [];
        let currentDate = startDate;
        while (currentDate <= endDate) {
            days.push(currentDate);
            currentDate = addDays(currentDate, 1);
        }
        return days;
    };
    const handlePrevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };
    const handleNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };
    const isDateDisabled = (date) => {
        if (minDate && isBefore(date, minDate))
            return true;
        if (maxDate && isAfter(date, maxDate))
            return true;
        return false;
    };
    const calendarDays = generateCalendarDays();
    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
    return (React.createElement("div", { className: className },
        React.createElement("div", { ref: refs.setReference },
            React.createElement(Input, { ref: inputRef, value: inputValue, onChange: handleInputChange, onClick: handleInputClick, onFocus: handleInputFocus, onKeyDown: handleKeyDown, placeholder: placeholder, disabled: disabled, label: label, helperText: helperText, error: error, size: size, variant: variant, clearable: inputValue.length > 0, onClear: handleClear, rightIcon: React.createElement("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" })) })),
        isOpen && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "fixed inset-0 z-40", onClick: () => setIsOpen(false) }),
            React.createElement("div", { ref: refs.setFloating, style: {
                    ...floatingStyles,
                    backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                }, className: "relative z-50 border border-border dark:border-gray-700 rounded-lg shadow-xl", onClick: (e) => {
                    e.stopPropagation();
                } },
                React.createElement("div", { ref: arrowRef, className: "absolute w-2 h-2 border-l border-t border-border dark:border-gray-700 transform rotate-45 -translate-y-1", style: {
                        left: context.middlewareData.arrow?.x,
                        top: -4,
                        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                    } }),
                React.createElement("div", { className: "p-4 w-80", style: {
                        backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                    } },
                    React.createElement("div", { className: "flex items-center justify-between mb-4" },
                        React.createElement("button", { onClick: handlePrevMonth, className: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 border border-border dark:border-gray-600 bg-background dark:!bg-gray-800 text-foreground dark:!text-white disabled:pointer-events-none disabled:opacity-50" },
                            React.createElement("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }))),
                        React.createElement("h2", { className: "text-sm font-medium text-foreground dark:!text-white" }, format(currentMonth, "yyyy년 M월", { locale: ko })),
                        React.createElement("button", { onClick: handleNextMonth, className: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 border border-border dark:border-gray-600 bg-background dark:!bg-gray-800 text-foreground dark:!text-white disabled:pointer-events-none disabled:opacity-50" },
                            React.createElement("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })))),
                    React.createElement("div", { className: "grid gap-1 mb-2", style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(7, 1fr)",
                            width: "100%",
                        } }, weekDays.map((day) => (React.createElement("div", { key: day, className: "h-8 w-8 flex items-center justify-center text-xs font-medium text-muted-foreground dark:text-gray-300", style: { minWidth: "2rem", maxWidth: "2rem" } }, day)))),
                    React.createElement("div", { className: "grid gap-1", style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(7, 1fr)",
                            width: "100%",
                        } }, calendarDays.map((date, index) => {
                        const isSelected = value && isSameDay(date, value);
                        const isCurrentMonth = isSameMonth(date, currentMonth);
                        const isDisabled = isDateDisabled(date);
                        const isTodayDate = isToday(date);
                        return (React.createElement("button", { key: index, onClick: (e) => {
                                console.log("Button clicked for date:", date, "disabled:", isDisabled);
                                e.stopPropagation();
                                if (!isDisabled) {
                                    handleDayClick(date);
                                }
                            }, disabled: isDisabled, className: `
                        h-8 w-8 p-0 text-sm font-normal rounded-md transition-colors flex items-center justify-center
                        ${isSelected
                                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                                : isTodayDate
                                    ? "bg-accent text-accent-foreground dark:bg-gray-700 dark:text-white"
                                    : "hover:bg-accent hover:text-accent-foreground text-foreground dark:!text-white dark:hover:bg-gray-700"}
                        ${!isCurrentMonth
                                ? "text-muted-foreground opacity-50 dark:text-gray-600"
                                : ""}
                        ${isDisabled
                                ? "text-muted-foreground opacity-50 cursor-not-allowed dark:text-gray-600"
                                : ""}
                      `.trim(), style: {
                                minWidth: "2rem",
                                maxWidth: "2rem",
                                minHeight: "2rem",
                                maxHeight: "2rem",
                            } }, format(date, "d")));
                    }))))))));
}
