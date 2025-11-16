'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { useTheme } from '@/hooks/useTheme';

interface ProjectStatusChartProps {
    data: {
        status: string;
        count: number;
    }[];
}


const getStatusColor = (status: string, isDark: boolean): string => {
    if (isDark) {
        const darkColorMap: Record<string, string> = {
            'Activos': '#fdd000',
            'Inactivos': '#6b7280',
            'Completados': '#34d399',
            'Cancelados': '#f87171',
        };
        return darkColorMap[status] || '#fdd000';
    } else {
        const lightColorMap: Record<string, string> = {
            'Activos': 'hsl(var(--chart-1))',
            'Inactivos': 'hsl(var(--chart-2))',
            'Completados': '#10b981',
            'Cancelados': 'hsl(var(--destructive))',
        };
        return lightColorMap[status] || 'hsl(var(--chart-1))';
    }
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-border bg-card p-3 shadow-xl backdrop-blur-sm">
                <p className="font-semibold text-foreground mb-1.5">{label}</p>
                <p className="text-sm text-muted-foreground">
                    <span className="font-bold text-foreground text-base">{payload[0].value}</span>{' '}
                    <span className="text-xs">proyecto{payload[0].value !== 1 ? 's' : ''}</span>
                </p>
            </div>
        );
    }
    return null;
};

export default function ProjectStatusChart({ data }: ProjectStatusChartProps) {
    const { isDark } = useTheme();
    const total = data.reduce((sum, item) => sum + item.count, 0);

    return (
        <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Estado de Proyectos</CardTitle>
                        <CardDescription className="mt-1">Distribución por estado</CardDescription>
                    </div>
                    {total > 0 && (
                        <div className="text-right">
                            <p className="text-2xl font-bold text-foreground">{total}</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {total === 0 ? (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        <p>No hay proyectos registrados</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 10, left: 0, bottom: 10 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                                opacity={isDark ? 0.2 : 0.3}
                            />
                            <XAxis
                                dataKey="status"
                                tick={{
                                    fill: isDark ? 'rgba(245, 245, 245, 0.8)' : 'hsl(var(--muted-foreground))',
                                    fontSize: 12,
                                    fontWeight: 500,
                                }}
                                axisLine={{
                                    stroke: isDark ? 'rgba(255, 255, 255, 0.15)' : 'hsl(var(--border))',
                                    strokeWidth: 1,
                                }}
                                tickLine={{
                                    stroke: isDark ? 'rgba(255, 255, 255, 0.15)' : 'hsl(var(--border))',
                                }}
                            />
                            <YAxis
                                tick={{
                                    fill: isDark ? 'rgba(245, 245, 245, 0.8)' : 'hsl(var(--muted-foreground))',
                                    fontSize: 12,
                                }}
                                axisLine={{
                                    stroke: isDark ? 'rgba(255, 255, 255, 0.15)' : 'hsl(var(--border))',
                                    strokeWidth: 1,
                                }}
                                tickLine={{
                                    stroke: isDark ? 'rgba(255, 255, 255, 0.15)' : 'hsl(var(--border))',
                                }}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{
                                    fill: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                }}
                            />
                            <Bar
                                dataKey="count"
                                radius={[12, 12, 0, 0]}
                                barSize={60}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={getStatusColor(entry.status, isDark)}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}

