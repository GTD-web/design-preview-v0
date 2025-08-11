import React, { useState, useRef, useEffect, useCallback, useMemo, } from "react";
import { useFloating, autoUpdate, offset, flip, shift, arrow, } from "@floating-ui/react";
import { format, parse, isValid, startOfMonth, endOfMonth, addMonths, subMonths, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, isToday, isBefore, isAfter, isWithinInterval, } from "date-fns";
import { ko } from "date-fns/locale";
import { Input } from "./Input";
import { Button } from "./Button";
import { useDesignSettings } from "../hooks/useDesignSettings";
export function DayRangePicker({ value = {}, onChange, minDate, maxDate, disabled = false, placeholder = "2025.01.01-2025.01.31 (다양한 형식 지원)", className = "", label, helperText, error = false, size = "md", variant = "default", triggerType = "input", dateFormat = "default", calendarPosition = 50, }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [hoverDate, setHoverDate] = useState(null);
    const arrowRef = useRef(null);
    const inputRef = useRef(null);
    const { theme } = useDesignSettings();
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
    // 날짜 범위 포맷팅 함수
    const formatDisplayRange = useCallback((startDate, endDate) => {
        return `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;
    }, [formatDisplayDate]);
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
            setInputValue(formatDisplayRange(startDate, endDate));
            setCurrentMonth(startDate);
        }
        else if (startDate) {
            setInputValue(`${formatDisplayDate(startDate)} - `);
            setCurrentMonth(startDate);
        }
        else {
            setInputValue("");
        }
    }, [value, formatDisplayDate, formatDisplayRange]);
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
    };
    const handleInputBlur = () => {
        const trimmedValue = inputValue.trim();
        if (!trimmedValue) {
            onChange?.({});
            return;
        }
        // 날짜 범위 파싱 시도 - 다양한 구분자 지원
        try {
            // 다양한 구분자로 분리 시도: " - ", "-", " ~ ", "~"
            let rangeParts = [];
            if (trimmedValue.includes(" - ")) {
                rangeParts = trimmedValue.split(" - ");
            }
            else if (trimmedValue.includes("-")) {
                rangeParts = trimmedValue.split("-");
            }
            else if (trimmedValue.includes(" ~ ")) {
                rangeParts = trimmedValue.split(" ~ ");
            }
            else if (trimmedValue.includes("~")) {
                rangeParts = trimmedValue.split("~");
            }
            if (rangeParts.length === 2) {
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
                let startDate = null;
                let endDate = null;
                // 시작일 파싱
                for (const formatStr of formats) {
                    try {
                        const parsed = parse(rangeParts[0].trim(), formatStr, new Date(), {
                            locale: ko,
                        });
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
                        const parsed = parse(rangeParts[1].trim(), formatStr, new Date(), {
                            locale: ko,
                        });
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
                    if (minDate && isBefore(startDate, minDate)) {
                        // 잘못된 날짜면 원래 값으로 복원
                        const { startDate: origStart, endDate: origEnd } = value;
                        if (origStart && origEnd) {
                            setInputValue(formatDisplayRange(origStart, origEnd));
                        }
                        else {
                            setInputValue("");
                        }
                        return;
                    }
                    if (maxDate && isAfter(endDate, maxDate)) {
                        // 잘못된 날짜면 원래 값으로 복원
                        const { startDate: origStart, endDate: origEnd } = value;
                        if (origStart && origEnd) {
                            setInputValue(formatDisplayRange(origStart, origEnd));
                        }
                        else {
                            setInputValue("");
                        }
                        return;
                    }
                    // 성공적으로 파싱된 경우 설정된 형식으로 변환하여 표시
                    const formattedValue = formatDisplayRange(startDate, endDate);
                    setInputValue(formattedValue);
                    onChange?.({ startDate, endDate });
                    setCurrentMonth(startDate);
                }
                else {
                    // 파싱 실패 시 원래 값으로 복원
                    const { startDate: origStart, endDate: origEnd } = value;
                    if (origStart && origEnd) {
                        setInputValue(formatDisplayRange(origStart, origEnd));
                    }
                    else {
                        setInputValue("");
                    }
                }
            }
            else {
                // 파싱 실패 시 원래 값으로 복원
                const { startDate: origStart, endDate: origEnd } = value;
                if (origStart && origEnd) {
                    setInputValue(formatDisplayRange(origStart, origEnd));
                }
                else {
                    setInputValue("");
                }
            }
        }
        catch {
            // 파싱 실패 시 원래 값으로 복원
            const { startDate: origStart, endDate: origEnd } = value;
            if (origStart && origEnd) {
                setInputValue(formatDisplayRange(origStart, origEnd));
            }
            else {
                setInputValue("");
            }
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
    const handleDayClick = useCallback((date) => {
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
    }, [onChange, value]);
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
    const isDateInRange = useCallback((date) => {
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
    }, [value, hoverDate]);
    const isDateRangeStart = useCallback((date) => {
        const { startDate, endDate } = value;
        if (startDate && endDate) {
            return isSameDay(date, startDate);
        }
        if (startDate && !endDate && hoverDate) {
            const start = isBefore(startDate, hoverDate) ? startDate : hoverDate;
            return isSameDay(date, start);
        }
        return startDate && isSameDay(date, startDate);
    }, [value, hoverDate]);
    const isDateRangeEnd = useCallback((date) => {
        const { startDate, endDate } = value;
        if (startDate && endDate) {
            return isSameDay(date, endDate);
        }
        if (startDate && !endDate && hoverDate) {
            const end = isAfter(startDate, hoverDate) ? startDate : hoverDate;
            return isSameDay(date, end);
        }
        return false;
    }, [value, hoverDate]);
    const weekDays = useMemo(() => ["월", "화", "수", "목", "금", "토", "일"], []);
    // 캘린더 위치 계산 (0-100을 -50% ~ +50%로 변환)
    const calendarTransformX = useMemo(() => {
        const clampedPosition = Math.max(0, Math.min(100, calendarPosition));
        return `${clampedPosition - 50}%`;
    }, [calendarPosition]);
    return (React.createElement("div", { className: className },
        React.createElement("div", { ref: refs.setReference }, triggerType === "input" ? (React.createElement(Input, { ref: inputRef, value: inputValue, onChange: handleInputChange, onBlur: handleInputBlur, onClick: handleInputClick, onFocus: handleInputFocus, onKeyDown: handleKeyDown, placeholder: placeholder, disabled: disabled, label: label, helperText: helperText, error: error, size: size, variant: variant, clearable: inputValue.length > 0, onClear: handleClear, rightIcon: React.createElement("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" })) })) : (React.createElement(Button, { onClick: handleInputClick, disabled: disabled, variant: variant === "outlined" ? "outline" : "secondary", size: size, className: `justify-between w-full ${error ? "border-red-500" : ""}` },
            React.createElement("span", { className: "text-left" }, value.startDate && value.endDate
                ? formatDisplayRange(value.startDate, value.endDate)
                : value.startDate
                    ? `${formatDisplayDate(value.startDate)} - `
                    : placeholder),
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
                React.createElement("div", { className: `p-4 w-96 ${theme === "shadcn-v0-dark" ? "bg-gray-800" : "bg-white"} rounded-md` },
                    React.createElement("div", { className: "flex items-center justify-between mb-4" },
                        React.createElement("button", { onClick: handlePrevMonth, className: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 border border-border /*dark:border-gray-600*/ bg-background /*dark:!bg-gray-800*/ text-foreground /*dark:!text-white*/ disabled:pointer-events-none disabled:opacity-50" },
                            React.createElement("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }))),
                        React.createElement("h2", { className: "text-sm font-medium text-foreground /*dark:!text-white*/" }, format(currentMonth, "yyyy년 M월", { locale: ko })),
                        React.createElement("button", { onClick: handleNextMonth, className: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 border border-border /*dark:border-gray-600*/ bg-background /*dark:!bg-gray-800*/ text-foreground /*dark:!text-white*/ disabled:pointer-events-none disabled:opacity-50" },
                            React.createElement("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })))),
                    React.createElement("div", { className: "grid mb-2", style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(7, 2.5rem)",
                            justifyContent: "center",
                            width: "100%",
                        } }, weekDays.map((day) => (React.createElement("div", { key: day, className: "h-10 w-10 flex items-center justify-center text-xs font-medium text-muted-foreground /*dark:text-gray-300*/", style: { minWidth: "2.5rem", maxWidth: "2.5rem" } }, day)))),
                    React.createElement("div", { className: "grid gap-y-2", style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(7, 2.5rem)",
                            justifyContent: "center",
                            width: "100%",
                            rowGap: "0.5rem",
                        } }, calendarDays.map((date, index) => {
                        const isInRange = isDateInRange(date);
                        const isRangeStart = isDateRangeStart(date);
                        const isRangeEnd = isDateRangeEnd(date);
                        const isCurrentMonth = isSameMonth(date, currentMonth);
                        const isDisabled = isDateDisabled(date);
                        const isTodayDate = isToday(date);
                        // 범위 연결 배경은 래퍼가 담당하고, 중간 날짜 버튼은 투명하게 만들어 끊김을 방지
                        const inRangeClasses = theme === "shadcn-v0-dark"
                            ? "bg-transparent text-white rounded-none font-medium"
                            : "bg-transparent text-gray-800 rounded-none font-medium";
                        const rangeContainerClass = (() => {
                            // 단일일은 래퍼 배경 불필요
                            if (isRangeStart && isRangeEnd)
                                return "";
                            // 시작/끝에서는 반쪽 오버레이를 쓰기 위한 컨테이너 속성만 적용
                            if (isRangeStart)
                                return "relative overflow-hidden rounded-l-md";
                            if (isRangeEnd)
                                return "relative overflow-hidden rounded-r-md";
                            if (isInRange)
                                return theme === "shadcn-v0-dark"
                                    ? "bg-gray-600"
                                    : "bg-gray-200";
                            return "";
                        })();
                        return (React.createElement("div", { key: index, className: `w-full h-10 flex items-center justify-center ${rangeContainerClass}` },
                            isRangeStart && !isRangeEnd && (React.createElement("span", { className: `absolute inset-y-0 left-1/2 right-0 ${theme === "shadcn-v0-dark"
                                    ? "bg-gray-600"
                                    : "bg-gray-200"}` })),
                            isRangeEnd && !isRangeStart && (React.createElement("span", { className: `absolute inset-y-0 left-0 right-1/2 ${theme === "shadcn-v0-dark"
                                    ? "bg-gray-600"
                                    : "bg-gray-200"}` })),
                            React.createElement("button", { onClick: (e) => {
                                    console.log("Button clicked for date:", date, "disabled:", isDisabled);
                                    e.stopPropagation();
                                    if (!isDisabled) {
                                        handleDayClick(date);
                                    }
                                }, onMouseEnter: () => setHoverDate(date), onMouseLeave: () => setHoverDate(null), disabled: isDisabled, className: `
                         h-10 w-10 p-0 text-sm font-normal transition-colors flex items-center justify-center
                          ${isRangeStart && isRangeEnd
                                    ? "bg-gray-700 text-white hover:bg-gray-800 hover:text-white rounded-md font-medium"
                                    : isRangeStart
                                        ? "bg-gray-700 text-white hover:bg-gray-800 hover:text-white rounded-none font-medium"
                                        : isRangeEnd
                                            ? "bg-gray-700 text-white hover:bg-gray-800 hover:text-white rounded-none font-medium"
                                            : isInRange
                                                ? inRangeClasses
                                                : isTodayDate
                                                    ? "bg-accent text-accent-foreground /*dark:bg-gray-700 dark:text-white*/"
                                                    : "hover:bg-accent hover:text-accent-foreground text-foreground /*dark:!text-white dark:hover:bg-gray-700*/"}
                         ${!isCurrentMonth
                                    ? "text-muted-foreground opacity-50 /*dark:text-gray-600*/"
                                    : ""}
                         ${isDisabled
                                    ? "text-muted-foreground opacity-50 cursor-not-allowed /*dark:text-gray-600*/"
                                    : ""}
                       `.trim(), style: {
                                    minWidth: "2.5rem",
                                    maxWidth: "2.5rem",
                                    minHeight: "2.5rem",
                                    maxHeight: "2.5rem",
                                } }, format(date, "d"))));
                    })),
                    React.createElement("div", { className: "mt-3 text-xs text-gray-500 text-center" }, !value.startDate
                        ? "시작 날짜를 선택하세요"
                        : !value.endDate
                            ? "종료 날짜를 선택하세요"
                            : "범위가 선택되었습니다")))))));
}
