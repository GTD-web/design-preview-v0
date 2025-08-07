import React, { useState, useRef, useEffect } from "react";
import { useFloating, autoUpdate, offset, flip, shift, arrow, } from "@floating-ui/react";
import { format, parse, isValid, startOfMonth, endOfMonth, addMonths, subMonths, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, isToday, isBefore, isAfter, isWithinInterval, } from "date-fns";
import { ko } from "date-fns/locale";
import { Input } from "./Input";
import { Button } from "./Button";
export function DayRangePicker({ value = {}, onChange, minDate, maxDate, disabled = false, placeholder = "날짜 범위를 선택하세요", className = "", label, helperText, error = false, size = "md", variant = "default", }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [hoverDate, setHoverDate] = useState(null);
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
    // value가 변경되면 input 값과 currentMonth 업데이트
    useEffect(() => {
        const { startDate, endDate } = value;
        if (startDate && endDate) {
            setInputValue(`${format(startDate, "yyyy. MM. dd", { locale: ko })} - ${format(endDate, "yyyy. MM. dd", { locale: ko })}`);
            setCurrentMonth(startDate);
        }
        else if (startDate) {
            setInputValue(`${format(startDate, "yyyy. MM. dd", { locale: ko })} - `);
            setCurrentMonth(startDate);
        }
        else {
            setInputValue("");
        }
    }, [value]);
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        // 날짜 범위 파싱 시도 (예: "2024.01.01 - 2024.01.31")
        if (newValue.trim()) {
            try {
                const rangeParts = newValue.split(" - ");
                if (rangeParts.length === 2) {
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
                    let startDate = null;
                    let endDate = null;
                    // 시작일 파싱
                    for (const formatStr of formats) {
                        try {
                            const parsed = parse(rangeParts[0].trim(), formatStr, new Date(), { locale: ko });
                            if (isValid(parsed)) {
                                startDate = parsed;
                                break;
                            }
                        }
                        catch {
                            continue;
                        }
                    }
                    // 종료일 파싱
                    for (const formatStr of formats) {
                        try {
                            const parsed = parse(rangeParts[1].trim(), formatStr, new Date(), { locale: ko });
                            if (isValid(parsed)) {
                                endDate = parsed;
                                break;
                            }
                        }
                        catch {
                            continue;
                        }
                    }
                    if (startDate && endDate && isValid(startDate) && isValid(endDate)) {
                        // 날짜 순서 확인 및 수정
                        if (isAfter(startDate, endDate)) {
                            [startDate, endDate] = [endDate, startDate];
                        }
                        // 날짜 범위 체크
                        if (minDate && isBefore(startDate, minDate))
                            return;
                        if (maxDate && isAfter(endDate, maxDate))
                            return;
                        onChange?.({ startDate, endDate });
                        setCurrentMonth(startDate);
                    }
                }
            }
            catch {
                // 파싱 실패 시 무시
            }
        }
        else {
            onChange?.({});
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
        console.log("DayRangePicker - Date clicked:", date);
        const { startDate, endDate } = value;
        if (!startDate || (startDate && endDate)) {
            // 새 범위 시작 또는 기존 범위 리셋
            console.log("Setting start date:", date);
            onChange?.({ startDate: date });
        }
        else if (startDate && !endDate) {
            // 종료일 선택
            if (isBefore(date, startDate)) {
                // 선택한 날짜가 시작일보다 이전이면 순서 바꿈
                console.log("Setting range (reversed):", date, "to", startDate);
                onChange?.({ startDate: date, endDate: startDate });
            }
            else {
                console.log("Setting range:", startDate, "to", date);
                onChange?.({ startDate, endDate: date });
            }
            // 범위 선택 완료되면 캘린더 닫기
            setTimeout(() => {
                setIsOpen(false);
                inputRef.current?.focus();
            }, 100);
        }
    };
    const handleClear = () => {
        setInputValue("");
        onChange?.({});
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
    const isDateInRange = (date) => {
        const { startDate, endDate } = value;
        if (startDate && endDate) {
            return isWithinInterval(date, { start: startDate, end: endDate });
        }
        // 선택중인 상태에서 hover 효과
        if (startDate && !endDate && hoverDate) {
            const start = isBefore(startDate, hoverDate) ? startDate : hoverDate;
            const end = isAfter(startDate, hoverDate) ? startDate : hoverDate;
            return isWithinInterval(date, { start, end });
        }
        return false;
    };
    const isDateRangeStart = (date) => {
        const { startDate, endDate } = value;
        if (startDate && endDate) {
            return isSameDay(date, startDate);
        }
        if (startDate && !endDate && hoverDate) {
            const start = isBefore(startDate, hoverDate) ? startDate : hoverDate;
            return isSameDay(date, start);
        }
        return startDate && isSameDay(date, startDate);
    };
    const isDateRangeEnd = (date) => {
        const { startDate, endDate } = value;
        if (startDate && endDate) {
            return isSameDay(date, endDate);
        }
        if (startDate && !endDate && hoverDate) {
            const end = isAfter(startDate, hoverDate) ? startDate : hoverDate;
            return isSameDay(date, end);
        }
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
                    (value.startDate || value.endDate) && (React.createElement("div", { className: "mb-4 p-3 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-lg" },
                        React.createElement("div", { className: "flex items-center justify-between" },
                            React.createElement("div", { className: "text-sm" },
                                React.createElement("div", { className: "font-medium text-primary dark:text-primary mb-1" }, "\uC120\uD0DD\uB41C \uAE30\uAC04:"),
                                React.createElement("div", null,
                                    value.startDate && (React.createElement("span", { className: "text-primary font-medium" }, format(value.startDate, "yyyy. MM. dd", {
                                        locale: ko,
                                    }))),
                                    value.startDate && value.endDate && (React.createElement("span", { className: "mx-2 text-gray-500 dark:text-gray-400" }, "-")),
                                    value.endDate && (React.createElement("span", { className: "text-primary font-medium" }, format(value.endDate, "yyyy. MM. dd", {
                                        locale: ko,
                                    }))))),
                            React.createElement(Button, { variant: "ghost", size: "sm", onClick: handleClear, className: "text-gray-500 hover:text-gray-700" }, "\uCD08\uAE30\uD654")))),
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
                        const isInRange = isDateInRange(date);
                        const isRangeStart = isDateRangeStart(date);
                        const isRangeEnd = isDateRangeEnd(date);
                        const isCurrentMonth = isSameMonth(date, currentMonth);
                        const isDisabled = isDateDisabled(date);
                        const isTodayDate = isToday(date);
                        return (React.createElement("button", { key: index, onClick: (e) => {
                                console.log("Button clicked for date:", date, "disabled:", isDisabled);
                                e.stopPropagation();
                                if (!isDisabled) {
                                    handleDayClick(date);
                                }
                            }, onMouseEnter: () => setHoverDate(date), onMouseLeave: () => setHoverDate(null), disabled: isDisabled, className: `
                        h-8 w-8 p-0 text-sm font-normal transition-colors flex items-center justify-center
                        ${isRangeStart || isRangeEnd
                                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground rounded-md"
                                : isInRange
                                    ? "bg-primary/20 text-primary-foreground hover:bg-primary/30 rounded-none dark:bg-primary/30"
                                    : isTodayDate
                                        ? "bg-accent text-accent-foreground rounded-md dark:bg-gray-700 dark:text-white"
                                        : "hover:bg-accent hover:text-accent-foreground rounded-md text-foreground dark:!text-white dark:hover:bg-gray-700"}
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
                    })),
                    React.createElement("div", { className: "mt-3 text-xs text-gray-500 text-center" }, !value.startDate
                        ? "시작 날짜를 선택하세요"
                        : !value.endDate
                            ? "종료 날짜를 선택하세요"
                            : "범위가 선택되었습니다")))))));
}
