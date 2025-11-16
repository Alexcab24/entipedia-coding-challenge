'use client';

import { Moon, Sun, Info } from 'lucide-react';
import { Card, CardContent } from '../card';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

export default function AppearanceSection() {
    const { toggleTheme, isDark } = useTheme();

    return (
        <div className="space-y-6 rounded-lg transition-all duration-500">
            <div className="transition-all duration-500">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                    Tema de la Aplicación
                </h3>
                <p className="text-sm text-muted-foreground">
                    Elige entre modo claro u oscuro
                </p>
            </div>

            <Card className="border-border/60 transition-all duration-500">
                <CardContent className="p-6 transition-all duration-500">
                    <div className="flex items-center justify-between transition-all duration-500">
                        <div className="flex items-center gap-4 transition-all duration-500">
                            <div className={cn(
                                "p-3 rounded-lg transition-all duration-500",
                                isDark ? "bg-muted" : "bg-primary/10"
                            )}>
                                {isDark ? (
                                    <Moon className="h-5 w-5 text-primary transition-all duration-500" />
                                ) : (
                                    <Sun className="h-5 w-5 text-primary transition-all duration-500" />
                                )}
                            </div>
                            <div className="transition-all duration-500">
                                <p className="font-medium text-foreground transition-all duration-500">
                                    Modo {isDark ? 'Oscuro' : 'Claro'}
                                </p>
                                <p className="text-sm text-muted-foreground transition-all duration-500">
                                    {isDark
                                        ? 'Interfaz con colores oscuros para reducir la fatiga visual'
                                        : 'Interfaz con colores claros, ideal para uso diurno'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={cn(
                                "relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                isDark ? "bg-primary" : "bg-secondary"
                            )}
                            aria-label="Toggle theme"
                        >
                            <span
                                className={cn(
                                    "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                                    isDark ? "translate-x-6" : "translate-x-1"
                                )}
                            />
                        </button>
                    </div>
                </CardContent>
            </Card>

            <div className="rounded-lg border border-border/60 bg-muted/30 p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Sobre los temas</p>
                    <p>
                        El tema se guarda en tu navegador y se aplicará automáticamente en futuras visitas.
                    </p>
                </div>
            </div>
        </div>
    );
}

