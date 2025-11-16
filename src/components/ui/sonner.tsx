"use client"

import { Toaster as Sonner } from "sonner"
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react"
import { useTheme } from "@/hooks/useTheme"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme } = useTheme()

    return (
        <Sonner
            theme={theme}
            className="toaster group"
            position="top-center"
            richColors={false}
            closeButton={false}
            expand={true}
            duration={4000}
            offset={16}
            gap={12}
            visibleToasts={5}
            toastOptions={{
                unstyled: false,
                style: {
                    willChange: 'transform',
                },
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl group-[.toaster]:p-4 group-[.toaster]:backdrop-blur-sm group-[.toaster]:transition-all group-[.toaster]:duration-300 group-[.toaster]:hover:shadow-2xl",
                    description:
                        "group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:mt-1.5 group-[.toast]:leading-relaxed",
                    title:
                        "group-[.toast]:font-semibold group-[.toast]:text-base group-[.toast]:leading-tight",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-lg group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:hover:bg-primary/90 group-[.toast]:transition-all group-[.toast]:duration-200 group-[.toast]:hover:scale-105 group-[.toast]:active:scale-95",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:hover:bg-muted/80 group-[.toast]:transition-all group-[.toast]:duration-200 group-[.toast]:hover:scale-105 group-[.toast]:active:scale-95",
                    success:
                        "group-[.toaster]:!bg-primary/95 group-[.toaster]:!border-primary/80 group-[.toaster]:!text-primary-foreground group-[.toaster]:shadow-primary/20",
                    error:
                        "group-[.toaster]:!bg-destructive/95 group-[.toaster]:!border-destructive/80 group-[.toaster]:!text-white group-[.toaster]:shadow-destructive/20",
                    info:
                        "group-[.toaster]:!bg-blue-500/95 group-[.toaster]:!border-blue-500/80 group-[.toaster]:!text-white group-[.toaster]:shadow-blue-500/20",
                    warning:
                        "group-[.toaster]:!bg-orange-500/95 group-[.toaster]:!border-orange-500/80 group-[.toaster]:!text-white group-[.toaster]:shadow-orange-500/20",
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

