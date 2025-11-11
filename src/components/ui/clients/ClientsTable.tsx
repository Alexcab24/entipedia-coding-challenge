'use client';

import { useState } from 'react';
import {
    Table,
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
import { FileText } from 'lucide-react';

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

    const normalizeValue = (value: string | null, field: string, client?: Client): string | null => {
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

    const handleSave = async (clientId: string, field: string, value?: string, client?: Client) => {
        if (!editingCell) return;

        const valueToSave = value !== undefined ? value : editValue;
        const finalValue = normalizeValue(valueToSave || null, field, client);
        const originalValue = normalizeValue(editingCell.originalValue, field, client);


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
                    className="cursor-pointer hover:bg-muted/50 max-w-[300px]"
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
            return (
                <TableCell
                    className="cursor-pointer hover:bg-muted/50 min-w-[120px]"
                    onClick={() => handleCellClick(client.id, field, currentValue)}
                >
                    {displayValue || '-'}
                </TableCell>
            );
        }

        if (inputType === 'select') {
            return (
                <TableCell>
                    <Select
                        value={editValue || 'individual'}
                        onValueChange={(value) => {
                            setEditValue(value);

                            const originalValue = editingCell?.originalValue || '';
                            if (value !== originalValue) {
                                setTimeout(() => {
                                    handleSave(client.id, field, value, client);
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
                <TableCell>
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
                <TableCell>
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
                <TableCell>
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
            <TableCell>
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
        <div className="hidden lg:block rounded-md border overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Desde</TableHead>
                        <TableHead>Hasta</TableHead>
                        <TableHead>Notas</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center text-muted-foreground">
                                No hay clientes registrados
                            </TableCell>
                        </TableRow>
                    ) : (
                        clients.map((client) => (
                            <TableRow key={client.id}>
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

                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(client)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

