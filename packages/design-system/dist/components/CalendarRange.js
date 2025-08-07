import React, { useState } from "react";
import { DayPicker, } from "react-day-picker";
import { ko } from "date-fns/locale";
import { Button } from "./Button";
import { TextValue } from "./Text";
export function CalendarRange({ value = {}, onChange, minDate, maxDate, disabled = false, className = "", ...props }) {
    const [month, setMonth] = useState(new Date());
    // DateRange 변환
    const selected = value.startDate || value.endDate
        ? { from: value.startDate, to: value.endDate }
        : undefined;
    const handleRangeSelect = (range) => {
        if (!range) {
            onChange?.({});
            return;
        }
        onChange?.({
            startDate: range.from,
            endDate: range.to,
        });
    };
    const clearRange = () => {
        onChange?.({});
    };
    return (React.createElement("div", { className: `bg-[var(--color-surface)] border border-border rounded-lg ${className.includes("p-") ? "" : "p-4"} ${className}`.trim(), ...props, style: {
            "--rdp-cell-size": "2rem",
            "--rdp-accent-color": "hsl(var(--primary))",
            "--rdp-background-color": "hsl(var(--primary) / 0.1)",
            "--rdp-accent-color-dark": "hsl(var(--primary))",
            "--rdp-background-color-dark": "hsl(var(--primary) / 0.1)",
            "--rdp-outline": "2px solid hsl(var(--primary))",
            "--rdp-outline-selected": "2px solid hsl(var(--primary))",
            "--rdp-selected-color": "white",
        } },
        (value.startDate || value.endDate) && (React.createElement("div", { className: "mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg" },
            React.createElement("div", { className: "flex items-center justify-between" },
                React.createElement("div", { className: "text-sm" },
                    React.createElement(TextValue, { weight: "medium" }, "\uC120\uD0DD\uB41C \uAE30\uAC04:"),
                    React.createElement("div", { className: "mt-1" },
                        value.startDate && (React.createElement("span", { className: "text-primary font-medium" }, value.startDate.toLocaleDateString("ko-KR"))),
                        value.startDate && value.endDate && (React.createElement("span", { className: "mx-2 text-gray-500" }, "-")),
                        value.endDate && (React.createElement("span", { className: "text-primary font-medium" }, value.endDate.toLocaleDateString("ko-KR"))))),
                React.createElement(Button, { variant: "ghost", size: "sm", onClick: clearRange, className: "text-gray-500 hover:text-gray-700" }, "\uCD08\uAE30\uD654")))),
        React.createElement(DayPicker, { mode: "range", selected: selected, onSelect: handleRangeSelect, month: month, onMonthChange: setMonth, locale: ko, disabled: [
                ...(minDate ? [{ before: minDate }] : []),
                ...(maxDate ? [{ after: maxDate }] : []),
                ...(disabled
                    ? [{ from: new Date(1900, 0, 1), to: new Date(2100, 11, 31) }]
                    : []),
            ], components: {}, classNames: {
                months: "flex flex-col",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8 border border-border bg-background disabled:pointer-events-none disabled:opacity-50",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1 mt-4",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] flex items-center justify-center",
                row: "flex w-full mt-2",
                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                day: "inline-flex items-center justify-center rounded-md text-sm font-normal w-8 h-8 p-0 transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-selected:opacity-100",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_start: "day-range-start bg-primary text-primary-foreground rounded-l-md",
                day_range_end: "day-range-end bg-primary text-primary-foreground rounded-r-md",
                day_range_middle: "day-range-middle bg-primary/20 text-primary-foreground rounded-none",
                day_hidden: "invisible",
            } }),
        React.createElement("div", { className: "mt-3 text-xs text-gray-500 text-center" }, !value.startDate
            ? "시작 날짜를 선택하세요"
            : !value.endDate
                ? "종료 날짜를 선택하세요"
                : "범위가 선택되었습니다")));
}
