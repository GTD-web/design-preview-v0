import React, { useState, useRef, useEffect, useCallback, useMemo, } from "react";
import { useFloating, autoUpdate, offset, flip, shift, arrow, } from "@floating-ui/react";
import { format, parse, isValid, startOfMonth, endOfMonth, addMonths, subMonths, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, isToday, isBefore, isAfter, } from "date-fns";
import { ko } from "date-fns/locale";
import { Input } from "./Input";
import { Button } from "./Button";
import { useDesignSettings } from "../hooks/useDesignSettings";
export function DayPicker({ value, onChange, minDate, maxDate, disabled = false, placeholder = "2025.01.01 (다양한 형식 지원)", className = "", label, helperText, error = false, size = "md", variant = "default", triggerType = "input", dateFormat = "default", calendarPosition = 50, }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { theme } = useDesignSettings();
    const arrowRef = useRef(null);
    const inputRef = useRef(null);
    // 날짜 포맷팅 함수
    const formatDisplayDate = useCallback((date) => {
        switch (dateFormat) {
            case "long":
                return format(date, "yyyy년 MM월 dd일 (EEEE)", { locale: ko });
            case "short":
                return format(date, "yyyy.MM.dd (E)", { locale: ko });
            case "default":
            default:
                return format(date, "yyyy. MM. dd", { locale: ko });
        }
    }, [dateFormat]);
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
            const formattedValue = formatDisplayDate(value);
            // 상태 업데이트를 일괄 처리하여 깜박거림 방지
            requestAnimationFrame(() => {
                setInputValue((prev) => prev !== formattedValue ? formattedValue : prev);
                setCurrentMonth((prev) => (!isSameMonth(prev, value) ? value : prev));
            });
        }
        else {
            requestAnimationFrame(() => {
                setInputValue((prev) => (prev !== "" ? "" : prev));
            });
        }
    }, [value, formatDisplayDate]);
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
    };
    const handleInputBlur = () => {
        const trimmedValue = inputValue.trim();
        if (!trimmedValue) {
            onChange?.(undefined);
            return;
        }
        // 날짜 파싱 시도
        try {
            // 다양한 형식 지원 (순서 중요: 더 구체적인 형식부터)
            const formats = [
                "yyyy. MM. dd",
                "yyyy.MM.dd",
                "yyyy-MM-dd",
                "yyyy/MM/dd",
                "yyyy.M.d",
                "yyyy. M. d",
                "MM/dd/yyyy",
                "M/d/yyyy",
            ];
            let parsedDate = null;
            for (const formatStr of formats) {
                try {
                    const parsed = parse(trimmedValue, formatStr, new Date(), {
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
                if (minDate && isBefore(parsedDate, minDate)) {
                    // 잘못된 날짜면 원래 값으로 복원
                    setInputValue(value ? formatDisplayDate(value) : "");
                    return;
                }
                if (maxDate && isAfter(parsedDate, maxDate)) {
                    // 잘못된 날짜면 원래 값으로 복원
                    setInputValue(value ? formatDisplayDate(value) : "");
                    return;
                }
                // 성공적으로 파싱된 경우 설정된 형식으로 변환하여 표시
                const formattedValue = formatDisplayDate(parsedDate);
                setInputValue(formattedValue);
                onChange?.(parsedDate);
                setCurrentMonth(parsedDate);
            }
            else {
                // 파싱 실패 시 원래 값으로 복원
                setInputValue(value ? formatDisplayDate(value) : "");
            }
        }
        catch {
            // 파싱 실패 시 원래 값으로 복원
            setInputValue(value ? formatDisplayDate(value) : "");
        }
    };
    const handleInputClick = useCallback(() => {
        if (!disabled && !isOpen) {
            setIsOpen(true);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }, [disabled, isOpen]);
    const handleInputFocus = () => {
        if (!disabled) {
            setIsOpen(true);
        }
    };
    const handleDayClick = useCallback((date) => {
        // 먼저 onChange를 호출하여 상위 컴포넌트 상태를 업데이트
        if (onChange) {
            onChange(date);
        }
        // 캘린더는 닫지 않고 계속 열어둠
        // 포커스는 유지
    }, [onChange]);
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
            e.preventDefault();
            handleInputBlur(); // Enter 키로 즉시 형식 변환
            // 캘린더는 닫지 않고 계속 열어둠
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
    // 캘린더 날짜 생성 (메모이제이션) - 월요일 시작
    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const startDate = startOfWeek(monthStart, { locale: ko, weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { locale: ko, weekStartsOn: 1 });
        const days = [];
        let currentDate = startDate;
        while (currentDate <= endDate) {
            days.push(currentDate);
            currentDate = addDays(currentDate, 1);
        }
        return days;
    }, [currentMonth]);
    const handlePrevMonth = useCallback(() => {
        setCurrentMonth(subMonths(currentMonth, 1));
    }, [currentMonth]);
    const handleNextMonth = useCallback(() => {
        setCurrentMonth(addMonths(currentMonth, 1));
    }, [currentMonth]);
    const isDateDisabled = useCallback((date) => {
        if (minDate && isBefore(date, minDate))
            return true;
        if (maxDate && isAfter(date, maxDate))
            return true;
        return false;
    }, [minDate, maxDate]);
    const weekDays = useMemo(() => ["월", "화", "수", "목", "금", "토", "일"], []);
    // 캘린더 위치 계산 (0-100을 -50% ~ +50%로 변환)
    const calendarTransformX = useMemo(() => {
        const clampedPosition = Math.max(0, Math.min(100, calendarPosition));
        return `${clampedPosition - 50}%`;
    }, [calendarPosition]);
    return (React.createElement("div", { className: className },
        React.createElement("div", { ref: refs.setReference }, triggerType === "input" ? (React.createElement(Input, { ref: inputRef, value: inputValue, onChange: handleInputChange, onBlur: handleInputBlur, onClick: handleInputClick, onFocus: handleInputFocus, onKeyDown: handleKeyDown, placeholder: placeholder, disabled: disabled, label: label, helperText: helperText, error: error, size: size, variant: variant, clearable: inputValue.length > 0, onClear: handleClear, rightIcon: React.createElement("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" })) })) : (React.createElement(Button, { onClick: handleInputClick, disabled: disabled, variant: variant === "outlined" ? "outline" : "secondary", size: size, className: `justify-between w-full ${error ? "border-red-500" : ""}` },
            React.createElement("span", { className: "text-left" }, value ? formatDisplayDate(value) : placeholder),
            React.createElement("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }))))),
        isOpen && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "fixed inset-0 z-40", onClick: () => setIsOpen(false) }),
            React.createElement("div", { ref: refs.setFloating, style: {
                    ...floatingStyles,
                    transform: `${floatingStyles.transform || ""} translateX(${calendarTransformX})`.trim(),
                }, className: `relative z-50 border border-border rounded-lg shadow-xl ${theme === "shadcn-v0-dark"
                    ? "bg-gray-800 border-gray-600"
                    : "bg-white border-gray-200"}`, onClick: (e) => {
                    e.stopPropagation();
                } },
                React.createElement("div", { ref: arrowRef, className: `absolute w-2 h-2 border-l border-t transform rotate-45 -translate-y-1 ${theme === "shadcn-v0-dark"
                        ? "bg-gray-800 border-gray-600"
                        : "bg-white border-gray-200"}`, style: {
                        left: context.middlewareData.arrow?.x,
                        top: -4,
                    } }),
                React.createElement("div", { className: `p-4 w-80 ${theme === "shadcn-v0-dark" ? "bg-gray-800" : "bg-white"} rounded-md` },
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
                                ? "bg-primary text-white hover:bg-primary hover:text-black"
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
