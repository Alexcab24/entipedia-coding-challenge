'use client';

import { useState } from 'react';
import { Client } from '@/lib/actions/clients/get-clients';
import { formatCurrency } from '@/lib/utils/currency';
import { formatDate, formatDateToLocalString, parseLocalDateString } from '@/lib/utils/date';
import { Card, CardContent } from '../card';
import Button from '../Button';
import { Trash2, Edit2, Mail, Phone, Building2, User, DollarSign, Calendar, FileText, X, Check } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../select';
import Input from '../Input';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Calendar as CalendarComponent } from '../calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ClientCardProps {
    client: Client;
    onDelete: (client: Client) => void;
    onUpdate: (clientId: string, field: string, value: string | null) => Promise<void>;
}

export default function ClientCard({
    client,
    onDelete,
    onUpdate,
}: ClientCardProps) {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    const [originalValue, setOriginalValue] = useState<string | null>(null);

    const handleFieldClick = (field: string, currentValue: string | null) => {
        setEditingField(field);
        setOriginalValue(currentValue);
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

    const handleSave = async (field: string, value?: string) => {
        if (!editingField) return;

        const valueToSave = value !== undefined ? value : editValue;
        const finalValue = normalizeValue(valueToSave || null, field);
        const originalNormalized = normalizeValue(originalValue, field);


        if (finalValue !== originalNormalized) {
            await onUpdate(client.id, field, finalValue);
        }

        setEditingField(null);
        setEditValue('');
        setOriginalValue(null);
    };

    const handleCancel = () => {
        setEditingField(null);
        setEditValue('');
        setOriginalValue(null);
    };

    const renderEditableField = (
        field: string,
        label: string,
        displayValue: string,
        icon: React.ReactNode,
        inputType: 'text' | 'select' | 'currency' | 'date' | 'textarea' = 'text'
    ) => {
        const isEditing = editingField === field;
        const currentValue = client[field as keyof Client] as string | null;

        if (field === 'notes' && !isEditing) {
            const notesText = currentValue || '';
            const maxLength = 100;
            const isTruncated = notesText.length > maxLength;
            const truncatedText = isTruncated ? notesText.substring(0, maxLength) + '...' : notesText;

            return (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        {icon}
                        <span>{label}</span>
                    </div>
                    {notesText ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    className="w-full text-left text-sm text-foreground hover:text-primary transition-colors cursor-pointer p-2 rounded-md hover:bg-muted/50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFieldClick(field, currentValue);
                                    }}
                                >
                                    <div className="flex items-start gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                        <p className="line-clamp-3 break-words flex-1">{truncatedText}</p>
                                    </div>
                                </button>
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
                        <button
                            className="w-full text-left text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer p-2 rounded-md hover:bg-muted/50 flex items-center gap-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFieldClick(field, currentValue);
                            }}
                        >
                            <FileText className="h-4 w-4" />
                            <span>Agregar notas...</span>
                        </button>
                    )}
                </div>
            );
        }

        if (!isEditing) {
            return (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        {icon}
                        <span>{label}</span>
                    </div>
                    <button
                        className="w-full text-left text-sm text-foreground hover:text-primary transition-colors cursor-pointer p-2 rounded-md hover:bg-muted/50 flex items-center justify-between group"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleFieldClick(field, currentValue);
                        }}
                    >
                        <span className="flex-1">{displayValue || '-'}</span>
                        <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                    </button>
                </div>
            );
        }


        if (inputType === 'select') {
            return (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        {icon}
                        <span>{label}</span>
                    </div>
                    <div className="flex gap-2">
                        <Select
                            value={editValue || 'individual'}
                            onValueChange={(value) => {
                                setEditValue(value);
                                if (value !== originalValue) {
                                    setTimeout(() => {
                                        handleSave(field, value);
                                    }, 0);
                                } else {
                                    handleCancel();
                                }
                            }}
                        >
                            <SelectTrigger className="flex-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="individual">Persona</SelectItem>
                                <SelectItem value="company">Compañía</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            className="h-10 w-10 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            );
        }

        if (inputType === 'date') {
            return (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        {icon}
                        <span>{label}</span>
                    </div>
                    <div className="flex gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex-1 justify-start text-left font-normal"
                                >
                                    {editValue ? format(parseLocalDateString(editValue), 'PPP', { locale: es }) : 'Seleccionar fecha'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                    mode="single"
                                    selected={editValue ? parseLocalDateString(editValue) : undefined}
                                    onSelect={(date) => {
                                        if (date) {
                                            const dateValue = formatDateToLocalString(date);

                                            if (dateValue !== originalValue) {
                                                handleSave(field, dateValue);
                                            } else {
                                                handleCancel();
                                            }
                                        }
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            className="h-10 w-10 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            );
        }

        if (inputType === 'currency') {
            return (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        {icon}
                        <span>{label}</span>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            value={editValue}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^\d.,]/g, '');
                                setEditValue(value);
                            }}
                            onBlur={() => handleSave(field)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSave(field);
                                } else if (e.key === 'Escape') {
                                    handleCancel();
                                }
                            }}
                            autoFocus
                            className="flex-1"
                            placeholder="0.00"
                        />
                        <span className="text-sm text-muted-foreground self-center px-2">DOP</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSave(field)}
                            className="h-10 w-10 p-0"
                        >
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            className="h-10 w-10 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            );
        }

        if (inputType === 'textarea' || field === 'notes') {
            return (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        {icon}
                        <span>{label}</span>
                    </div>
                    <div className="space-y-2">
                        <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                    handleCancel();
                                }
                                if (e.key === 'Enter' && e.ctrlKey) {
                                    handleSave(field);
                                }
                            }}
                            autoFocus
                            className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none min-h-[80px]"
                            rows={4}
                            placeholder="Agregar notas..."
                        />
                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancel}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleSave(field)}
                            >
                                Guardar
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    {icon}
                    <span>{label}</span>
                </div>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleSave(field)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSave(field);
                            } else if (e.key === 'Escape') {
                                handleCancel();
                            }
                        }}
                        autoFocus
                        className="flex-1"
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSave(field)}
                        className="h-10 w-10 p-0"
                    >
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                        className="h-10 w-10 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-4">

                <div className="flex items-start justify-between gap-2 pb-3 border-b">
                    <div className="flex-1 min-w-0">
                        {renderEditableField(
                            'name',
                            'Nombre',
                            client.name,
                            <User className="h-4 w-4" />,
                            'text'
                        )}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(client)}
                        className="shrink-0"
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>


                <div className="grid grid-cols-1 gap-4">
                    {renderEditableField(
                        'email',
                        'Email',
                        client.email,
                        <Mail className="h-4 w-4" />,
                        'text'
                    )}

                    {renderEditableField(
                        'phone',
                        'Teléfono',
                        client.phone,
                        <Phone className="h-4 w-4" />,
                        'text'
                    )}

                    {renderEditableField(
                        'type',
                        'Tipo',
                        client.type === 'individual' ? 'Persona' : 'Compañía',
                        client.type === 'individual' ? <User className="h-4 w-4" /> : <Building2 className="h-4 w-4" />,
                        'select'
                    )}

                    {renderEditableField(
                        'value',
                        'Valor',
                        client.value ? formatCurrency(Number(client.value), 'DOP') : '-',
                        <DollarSign className="h-4 w-4" />,
                        'currency'
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {renderEditableField(
                            'dateFrom',
                            'Desde',
                            client.dateFrom ? formatDate(client.dateFrom) : '-',
                            <Calendar className="h-4 w-4" />,
                            'date'
                        )}

                        {renderEditableField(
                            'dateTo',
                            'Hasta',
                            client.dateTo ? formatDate(client.dateTo) : '-',
                            <Calendar className="h-4 w-4" />,
                            'date'
                        )}
                    </div>

                    {renderEditableField(
                        'notes',
                        'Notas',
                        client.notes || '-',
                        <FileText className="h-4 w-4" />,
                        'textarea'
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

