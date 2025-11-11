"use client"

import { Toaster as Sonner } from "sonner"
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="light"
            className="toaster group"
            position="top-center"
            richColors={false}
            closeButton
            expand={false}
            duration={4000}
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg group-[.toaster]:p-4",
                    description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:mt-1",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-lg group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:hover:bg-primary/90 group-[.toast]:transition-colors",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:hover:bg-muted/80 group-[.toast]:transition-colors",
                    success: "group-[.toaster]:!bg-primary/25 group-[.toaster]:!border-primary/70",
                    error: "group-[.toaster]:!bg-destructive/18 group-[.toaster]:!border-destructive/70",
                    info: "group-[.toaster]:!bg-card group-[.toaster]:!border-border",
                    warning: "group-[.toaster]:!bg-accent group-[.toaster]:!border-border",
                },
            }}
            icons={{
                success: <CheckCircle2 className="h-5 w-5" />,
                error: <XCircle className="h-5 w-5" />,
                info: <Info className="h-5 w-5" />,
                warning: <AlertTriangle className="h-5 w-5" />,
            }}
            {...props}
        />
    )
}

export { Toaster }

