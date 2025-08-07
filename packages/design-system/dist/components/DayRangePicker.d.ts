import React from "react";
export interface DateRange {
    startDate?: Date;
    endDate?: Date;
}
export interface DayRangePickerProps {
    value?: DateRange;
    onChange?: (range: DateRange) => void;
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    label?: string;
    helperText?: string;
    error?: boolean;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "filled" | "outlined";
    triggerType?: "input" | "button";
    dateFormat?: "default" | "long" | "short";
    calendarPosition?: number;
}
export declare function DayRangePicker({ value, onChange, minDate, maxDate, disabled, placeholder, className, label, helperText, error, size, variant, triggerType, dateFormat, calendarPosition, }: DayRangePickerProps): React.JSX.Element;
