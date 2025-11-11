'use client';

import { useState } from 'react';
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../table';
import { Client } from '@/lib/actions/clients/get-clients';
import { formatCurrency } from '@/lib/utils/currency';
import { formatDate, formatDateToLocalString, parseLocalDateString } from '@/lib/utils/date';
import Button from '../Button';
import { Trash2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../select';
import Input from '../Input';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Calendar } from '../calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, User, Building2, Mail, Phone, DollarSign, Calendar as CalendarIcon, StickyNote, MoreVertical } from 'lucide-react';

interface ClientsTableProps {
    clients: Client[];
    onDelete: (client: Client) => void;
    onUpdate: (clientId: string, field: string, value: string | null) => Promise<void>;
}

export default function ClientsTable({
    clients,
    onDelete,
    onUpdate,
}: ClientsTableProps) {
    const [editingCell, setEditingCell] = useState<{
        clientId: string;
        field: string;
        originalValue: string | null;
    } | null>(null);
    const [editValue, setEditValue] = useState<string>('');

    const handleCellClick = (clientId: string, field: string, currentValue: string | null) => {
        setEditingCell({ clientId, field, originalValue: currentValue });
        setEditValue(currentValue || '');
    };

    const normalizeValue = (value: string | null, field: string): string | null => {
        if (field === 'notes') {
            return value === '' ? '' : (value || null);
        }
        if (field === 'value') {
            if (!value || value.trim() === '') return null;
            const numericValue = value.replace(/[^\d.,]/g, '').replace(',', '.').trim();
            return numericValue === '' ? null : numericValue;
        }
        return value || null;
    };

    const getOriginalValue = (client: Client, field: string): string | null => {
        const currentValue = client[field as keyof Client] as string | null;
        return currentValue;
    };

    const handleSave = async (clientId: string, field: string, value?: string) => {
        if (!editingCell) return;

        const valueToSave = value !== undefined ? value : editValue;
        const finalValue = normalizeValue(valueToSave || null, field);
        const originalValue = normalizeValue(editingCell.originalValue, field);


        if (finalValue !== originalValue) {
            await onUpdate(clientId, field, finalValue);
        }

        setEditingCell(null);
        setEditValue('');
    };

    const handleCancel = () => {
        setEditingCell(null);
        setEditValue('');
    };

    const handleDelete = (client: Client) => {
        onDelete(client);
    };

    const renderEditableCell = (
        client: Client,
        field: string,
        displayValue: string,
        inputType: 'text' | 'select' | 'currency' | 'date' | 'textarea' = 'text'
    ) => {
        const isEditing = editingCell?.clientId === client.id && editingCell?.field === field;
        const currentValue = getOriginalValue(client, field);


        if (field === 'notes' && !isEditing) {
            const notesText = currentValue || '';
            const maxLength = 50;
            const isTruncated = notesText.length > maxLength;
            const truncatedText = isTruncated ? notesText.substring(0, maxLength) + '...' : notesText;

            return (
                <TableCell
                    className="cursor-pointer hover:bg-primary/5 max-w-[300px] px-6 py-5 text-sm transition-all duration-150"
                    onClick={() => handleCellClick(client.id, field, currentValue)}
                >
                    {notesText ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="flex items-start gap-2 group">
                                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0 group-hover:text-foreground transition-colors" />
                                    <p className="text-sm text-foreground line-clamp-2 break-words flex-1 min-w-0">
                                        {truncatedText}
                                    </p>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-80 p-4"
                                align="start"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <h4 className="font-semibold text-sm">Notas</h4>
                                    </div>
                                    <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                                        {notesText}
                                    </p>
                                </div>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    )}
                </TableCell>
            );
        }

        if (!isEditing) {

            if (field === 'type') {
                const isIndividual = displayValue === 'Persona';
                return (
                    <TableCell
                        className="cursor-pointer hover:bg-primary/5 transition-all duration-150 min-w-[120px] px-6 py-5 text-sm"
                        onClick={() => handleCellClick(client.id, field, currentValue)}
                    >
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${isIndividual
                            ? 'bg-blue-100/80 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50'
                            : 'bg-purple-100/80 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50'
                            }`}>
                            {isIndividual ? <User className="h-3.5 w-3.5" /> : <Building2 className="h-3.5 w-3.5" />}
                            {displayValue}
                        </span>
                    </TableCell>
                );
            }


            if (field === 'value' && displayValue !== '-') {
                return (
                    <TableCell
                        className="cursor-pointer hover:bg-primary/5 transition-all duration-150 min-w-[120px] px-6 py-5 text-sm"
                        onClick={() => handleCellClick(client.id, field, currentValue)}
                    >
                        <span className="inline-flex items-baseline gap-1 text-foreground font-semibold">
                            <span className="text-primary text-lg">$</span>
                            <span className="text-base">{displayValue.replace('$', '').trim()}</span>
                        </span>
                    </TableCell>
                );
            }


            return (
                <TableCell
                    className="cursor-pointer hover:bg-primary/5 transition-all duration-150 min-w-[120px] px-6 py-5 text-sm"
                    onClick={() => handleCellClick(client.id, field, currentValue)}
                >
                    {displayValue ? (
                        <span className="text-foreground font-medium">{displayValue}</span>
                    ) : (
                        <span className="text-muted-foreground/50 italic">—</span>
                    )}
                </TableCell>
            );
        }

        if (inputType === 'select') {
            return (
                <TableCell className="px-6 py-5">
                    <Select
                        value={editValue || 'individual'}
                        onValueChange={(value) => {
                            setEditValue(value);

                            const originalValue = editingCell?.originalValue || '';
                            if (value !== originalValue) {
                                setTimeout(() => {
                                    handleSave(client.id, field, value);
                                }, 0);
                            } else {
                                handleCancel();
                            }
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="individual">Persona</SelectItem>
                            <SelectItem value="company">Compañía</SelectItem>
                        </SelectContent>
                    </Select>
                </TableCell>
            );
        }

        if (inputType === 'date') {
            return (
                <TableCell className="px-6 py-5">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                            >
                                {editValue ? format(parseLocalDateString(editValue), 'PPP', { locale: es }) : 'Seleccionar fecha'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={editValue ? parseLocalDateString(editValue) : undefined}
                                onSelect={(date) => {
                                    if (date) {
                                        const dateValue = formatDateToLocalString(date);
                                        const originalValue = editingCell?.originalValue || null;
                                        if (dateValue !== originalValue) {
                                            handleSave(client.id, field, dateValue);
                                        } else {
                                            handleCancel();
                                        }
                                    }
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </TableCell>
            );
        }

        if (inputType === 'currency') {
            return (
                <TableCell className="px-6 py-5">
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            value={editValue}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^\d.,]/g, '');
                                setEditValue(value);
                            }}
                            onBlur={() => handleSave(client.id, field)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSave(client.id, field);
                                } else if (e.key === 'Escape') {
                                    handleCancel();
                                }
                            }}
                            autoFocus
                            className="w-full"
                            placeholder="0.00"
                        />
                        <span className="text-sm text-muted-foreground self-center">DOP</span>
                    </div>
                </TableCell>
            );
        }


        if (inputType === 'textarea' || field === 'notes') {
            return (
                <TableCell className="px-6 py-5">
                    <div className="space-y-2">
                        <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleSave(client.id, field)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    handleCancel();
                                }
                                if (e.key === 'Enter' && e.ctrlKey) {
                                    handleSave(client.id, field);
                                }
                            }}
                            autoFocus
                            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none min-h-[80px]"
                            rows={4}
                            placeholder="Agregar notas..."
                        />
                    </div>
                </TableCell>
            );
        }

        return (
            <TableCell className="px-6 py-5">
                <Input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleSave(client.id, field)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSave(client.id, field);
                        } else if (e.key === 'Escape') {
                            handleCancel();
                        }
                    }}
                    autoFocus
                    className="w-full"
                />
            </TableCell>
        );
    };

    return (
        <div className="hidden lg:flex flex-col rounded-xl border border-border/60 bg-card shadow-md overflow-hidden max-h-[600px]">
            {/* Header de la tabla */}
            <div className="shrink-0 overflow-hidden">
                <table className="w-full border-collapse caption-bottom text-sm" style={{ tableLayout: 'fixed' }}>
                    <TableHeader className="bg-primary/50 backdrop-blur-md z-10 border-b-2 border-primary/30">
                        <TableRow className="border-0 hover:bg-transparent">
                            <TableHead className="h-16 px-6 font-bold text-primary-foreground text-sm">
                                <div className="flex items-center justify-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-primary-foreground/10">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <span className="tracking-tight">Nombre</span>
                                </div>
                            </TableHead>
                            <TableHead className="h-16 px-6 font-bold text-primary-foreground text-sm">
                                <div className="flex items-center justify-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-primary-foreground/10">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <span className="tracking-tight">Email</span>
                                </div>
                            </TableHead>
                            <TableHead className="h-16 px-6 font-bold text-primary-foreground text-sm">
                                <div className="flex items-center justify-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-primary-foreground/10">
                                        <Building2 className="h-4 w-4" />
                                    </div>
                                    <span className="tracking-tight">Tipo</span>
                                </div>
                            </TableHead>
                            <TableHead className="h-16 px-6 font-bold text-primary-foreground text-sm">
                                <div className="flex items-center justify-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-primary-foreground/10">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <span className="tracking-tight">Teléfono</span>
                                </div>
                            </TableHead>
                            <TableHead className="h-16 px-6 font-bold text-primary-foreground text-sm">
                                <div className="flex items-center justify-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-primary-foreground/10">
                                        <DollarSign className="h-4 w-4" />
                                    </div>
                                    <span className="tracking-tight">Valor</span>
                                </div>
                            </TableHead>
                            <TableHead className="h-16 px-6 font-bold text-primary-foreground text-sm">
                                <div className="flex items-center justify-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-primary-foreground/10">
                                        <CalendarIcon className="h-4 w-4" />
                                    </div>
                                    <span className="tracking-tight">Desde</span>
                                </div>
                            </TableHead>
                            <TableHead className="h-16 px-6 font-bold text-primary-foreground text-sm">
                                <div className="flex items-center justify-center gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-primary-foreground/10">
                                        <CalendarIcon className="h-4 w-4" />
                                    </div>
                                    <span className="tracking-tight">Hasta</span>
                                </div>
                            </TableHead>
                            <TableHead className="h-16 px-6 font-bold text-primary-foreground text-sm">
                                <div className="flex items-center gap-2.5 justify-center">
                                    <div className="p-1.5 rounded-lg bg-primary-foreground/10">
                                        <StickyNote className="h-4 w-4" />
                                    </div>
                                    <span className="tracking-tight">Notas</span>
                                </div>
                            </TableHead>
                            <TableHead className="h-16 px-6 font-bold text-primary-foreground text-sm text-right">
                                <div className="flex items-center justify-end gap-2.5">
                                    <div className="p-1.5 rounded-lg bg-primary-foreground/10">
                                        <MoreVertical className="h-4 w-4" />
                                    </div>
                                    <span className="tracking-tight">Acciones</span>
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                </table>
            </div>
           {/* Body de la tabla */}
            <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto custom-scrollbar">
                <table className="w-full border-collapse caption-bottom text-sm" style={{ tableLayout: 'fixed' }}>
                    <TableBody className="bg-background/50 divide-y divide-border/20">
                        {clients.length === 0 ? (
                            <TableRow className="border-0 hover:bg-transparent">
                                <TableCell colSpan={9} className="text-center text-muted-foreground py-16">
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-base font-medium">No hay clientes registrados</span>
                                        <span className="text-sm text-muted-foreground/70">Comienza agregando tu primer cliente</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            clients.map((client) => (
                                <TableRow
                                    key={client.id}
                                    className="border-0 border-b-2 border-l-4 border-l-transparent hover:border-l-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-200 group"
                                >
                                    {renderEditableCell(client, 'name', client.name, 'text')}
                                    {renderEditableCell(
                                        client,
                                        'email',
                                        client.email,
                                        'text'
                                    )}
                                    {renderEditableCell(
                                        client,
                                        'type',
                                        client.type === 'individual' ? 'Persona' : 'Compañía',
                                        'select'
                                    )}
                                    {renderEditableCell(
                                        client,
                                        'phone',
                                        client.phone,
                                        'text'
                                    )}
                                    {renderEditableCell(
                                        client,
                                        'value',
                                        client.value ? formatCurrency(Number(client.value), 'DOP') : '-',
                                        'currency'
                                    )}
                                    {renderEditableCell(
                                        client,
                                        'dateFrom',
                                        client.dateFrom ? formatDate(client.dateFrom) : '-',
                                        'date'
                                    )}
                                    {renderEditableCell(
                                        client,
                                        'dateTo',
                                        client.dateTo ? formatDate(client.dateTo) : '-',
                                        'date'
                                    )}
                                    {renderEditableCell(
                                        client,
                                        'notes',
                                        client.notes || '-',
                                        'textarea'
                                    )}

                                    <TableCell className="text-right px-6 py-5">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(client)}
                                            className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200 opacity-50 group-hover:opacity-100 hover:scale-110 rounded-lg"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </table>
            </div>
        </div>
    );
}

