import React from "react";
export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    value?: Date;
    onChange?: (date: Date) => void;
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
    className?: string;
}
export declare function Calendar({ value, onChange, minDate, maxDate, disabled, className, ...props }: CalendarProps): React.JSX.Element;
