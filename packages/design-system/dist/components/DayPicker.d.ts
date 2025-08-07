import React from "react";
export interface DayPickerProps {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
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
export declare function DayPicker({ value, onChange, minDate, maxDate, disabled, placeholder, className, label, helperText, error, size, variant, triggerType, dateFormat, calendarPosition, }: DayPickerProps): React.JSX.Element;
