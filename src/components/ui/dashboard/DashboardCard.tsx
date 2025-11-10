import { Card, CardContent } from '../card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    className?: string;
    iconBgColor?: string;
    iconColor?: string;
}

export default function DashboardCard({
    title,
    value,
    icon: Icon,
    description,
    className,
    iconBgColor = 'bg-primary/10',
    iconColor = 'text-primary',
}: DashboardCardProps) {
    return (
        <Card
            className={cn(
                'group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1',
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                            {title}
                        </p>
                        <div className="text-3xl font-bold text-foreground mb-2">
                            {value}
                        </div>
                        {description && (
                            <p className="text-xs text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                    <div
                        className={cn(
                            'rounded-xl p-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3',
                            iconBgColor
                        )}
                    >
                        <Icon className={cn('h-6 w-6', iconColor)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

