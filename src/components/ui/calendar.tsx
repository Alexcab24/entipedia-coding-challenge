import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    month,
    ...props
}: CalendarProps) {
    const [currentMonth, setCurrentMonth] = React.useState<Date>(
        month || new Date()
    )

    React.useEffect(() => {
        if (month) {
            setCurrentMonth(month)
        }
    }, [month])

    const currentYear = currentMonth.getFullYear()
    const currentMonthIndex = currentMonth.getMonth()

    // Generar años (desde 10 años atrás hasta 10 años adelante)
    const years = React.useMemo(() => {
        const today = new Date().getFullYear()
        const yearsList = []
        for (let i = today - 10; i <= today + 10; i++) {
            yearsList.push(i)
        }
        return yearsList
    }, [])

    const handleMonthChange = (monthIndex: string) => {
        const newDate = new Date(currentYear, parseInt(monthIndex), 1)
        setCurrentMonth(newDate)
    }

    const handleYearChange = (year: string) => {
        const newDate = new Date(parseInt(year), currentMonthIndex, 1)
        setCurrentMonth(newDate)
    }

    const handlePreviousMonth = () => {
        const newDate = new Date(currentYear, currentMonthIndex - 1, 1)
        setCurrentMonth(newDate)
    }

    const handleNextMonth = () => {
        const newDate = new Date(currentYear, currentMonthIndex + 1, 1)
        setCurrentMonth(newDate)
    }

    return (
        <div className="space-y-3 p-2">
           
            <div className="flex items-center justify-between gap-2 px-2">
                <button
                    type="button"
                    onClick={handlePreviousMonth}
                    className={cn(
                        "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200",
                        "h-8 w-8 bg-background hover:bg-accent hover:text-accent-foreground",
                        "border border-border hover:border-primary/50",
                        "shadow-sm hover:shadow-md",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    )}
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-2 flex-1 justify-center">
                    <Select
                        value={currentMonthIndex.toString()}
                        onValueChange={handleMonthChange}
                    >
                        <SelectTrigger className="h-8 w-[140px] text-sm font-semibold border-border hover:border-primary/50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {MONTHS.map((month, index) => (
                                <SelectItem key={index} value={index.toString()}>
                                    {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={currentYear.toString()}
                        onValueChange={handleYearChange}
                    >
                        <SelectTrigger className="h-8 w-[90px] text-sm font-semibold border-border hover:border-primary/50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <button
                    type="button"
                    onClick={handleNextMonth}
                    className={cn(
                        "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200",
                        "h-8 w-8 bg-background hover:bg-accent hover:text-accent-foreground",
                        "border border-border hover:border-primary/50",
                        "shadow-sm hover:shadow-md",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    )}
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

          
            <DayPicker
                showOutsideDays={showOutsideDays}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className={cn("p-2", className)}
                classNames={{
                    months: "flex flex-col w-full text-center justify-center items-center sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "hidden",
                    caption_label: "text-base font-semibold text-foreground",
                    nav: "hidden",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex mb-2",
                    head_cell:
                        "text-muted-foreground rounded-md w-10 font-semibold text-xs uppercase tracking-wider",
                    row: "flex w-full mt-1",
                    cell: cn(
                        "h-full w-full text-center text-sm p-0 relative",
                        "[&:has([aria-selected].day-range-end)]:rounded-r-lg",
                        "[&:has([aria-selected].day-outside)]:bg-accent/50",
                        "[&:has([aria-selected])]:bg-accent",
                        "first:[&:has([aria-selected])]:rounded-l-lg",
                        "last:[&:has([aria-selected])]:rounded-r-lg",
                        "focus-within:relative focus-within:z-20"
                    ),
                    day: cn(
                        "h-10 w-10 p-0 text-center font-medium rounded-lg",
                        "transition-all duration-200",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        "aria-selected:opacity-100"
                    ),
                    day_range_end: "day-range-end",
                    day_selected: cn(
                        "bg-primary text-primary-foreground",
                        "hover:bg-primary/90 hover:text-primary-foreground",
                        "focus:bg-primary focus:text-primary-foreground",
                        "font-semibold shadow-sm",
                        "transition-all duration-200"
                    ),
                    day_today: cn(
                        "bg-accent text-accent-foreground font-semibold",
                        "border-2 border-primary/30",
                        "hover:border-primary/50 hover:bg-primary/10"
                    ),
                    day_outside: cn(
                        "day-outside text-muted-foreground opacity-40",
                        "aria-selected:bg-accent/30 aria-selected:text-muted-foreground",
                        "aria-selected:opacity-50"
                    ),
                    day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed hover:bg-transparent",
                    day_range_middle: cn(
                        "aria-selected:bg-primary/20 aria-selected:text-foreground",
                        "aria-selected:hover:bg-primary/30"
                    ),
                    day_hidden: "invisible",
                    ...classNames,
                }}
                {...props}
            />
        </div>
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
