import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
export function Calendar({ value, onChange, minDate, maxDate, disabled = false, className = "", ...props }) {
    const [month, setMonth] = useState(value || new Date());
    const handleDayClick = (day, modifiers) => {
        if (disabled || modifiers.disabled)
            return;
        onChange?.(day);
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
        React.createElement(DayPicker, { mode: "single", selected: value, onDayClick: handleDayClick, month: month, onMonthChange: setMonth, locale: ko, disabled: [
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
                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-middle)]:rounded-none first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                day: "inline-flex items-center justify-center rounded-md text-sm font-normal w-8 h-8 p-0 transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-selected:opacity-100",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
            } })));
}
