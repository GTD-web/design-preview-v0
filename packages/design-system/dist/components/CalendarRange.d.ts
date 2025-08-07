import React from "react";
export interface DateRange {
    startDate?: Date;
    endDate?: Date;
}
export interface CalendarRangeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
    value?: DateRange;
    onChange?: (range: DateRange) => void;
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
    className?: string;
}
export declare function CalendarRange({ value, onChange, minDate, maxDate, disabled, className, ...props }: CalendarRangeProps): React.JSX.Element;
