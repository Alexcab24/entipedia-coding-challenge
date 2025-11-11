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
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
                        <div className="p-1.5 rounded-lg bg-muted/50">
                            {icon}
                        </div>
                        <span>{label}</span>
                    </div>
                    {notesText ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    className="w-full text-left text-base text-foreground hover:text-primary transition-all duration-150 cursor-pointer p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent flex items-start gap-3 group border-2 border-transparent hover:border-primary/20 active:scale-[0.98] active:bg-primary/10 min-h-[56px]"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFieldClick(field, currentValue);
                                    }}
                                >
                                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                                        <FileText className="h-5 w-5 text-primary" />
                                    </div>
                                    <p className="line-clamp-3 break-words flex-1 font-medium text-base">{truncatedText}</p>
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
                            className="w-full text-left text-base text-muted-foreground hover:text-primary transition-all duration-150 cursor-pointer p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent flex items-center gap-3 border-2 border-dashed border-border hover:border-primary/30 active:scale-[0.98] active:bg-primary/10 min-h-[56px]"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFieldClick(field, currentValue);
                            }}
                        >
                            <div className="p-2 rounded-lg bg-muted/50">
                                <FileText className="h-5 w-5" />
                            </div>
                            <span className="font-medium">Agregar notas...</span>
                        </button>
                    )}
                </div>
            );
        }

        if (!isEditing) {
            // Special rendering for type field with badge
            if (field === 'type') {
                const isIndividual = displayValue === 'Persona';
                return (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
                            <div className="p-1.5 rounded-lg bg-muted/50">
                                {icon}
                            </div>
                            <span>{label}</span>
                        </div>
                        <button
                            className="w-full text-left cursor-pointer active:scale-[0.98] transition-all"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFieldClick(field, currentValue);
                            }}
                        >
                            <span className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 ${isIndividual
                                    ? 'bg-gradient-to-br from-blue-100 to-blue-50 text-blue-800 dark:from-blue-950/50 dark:to-blue-900/30 dark:text-blue-300 border-2 border-blue-200/60 dark:border-blue-800/50'
                                    : 'bg-gradient-to-br from-purple-100 to-purple-50 text-purple-800 dark:from-purple-950/50 dark:to-purple-900/30 dark:text-purple-300 border-2 border-purple-200/60 dark:border-purple-800/50'
                                }`}>
                                {isIndividual ? <User className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                                {displayValue}
                            </span>
                        </button>
                    </div>
                );
            }

            // Special rendering for value field
            if (field === 'value' && displayValue !== '-') {
                return (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
                            <div className="p-1.5 rounded-lg bg-muted/50">
                                {icon}
                            </div>
                            <span>{label}</span>
                        </div>
                        <button
                            className="w-full text-left cursor-pointer p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all active:scale-[0.98] border-2 border-transparent hover:border-primary/20 active:bg-primary/10 min-h-[56px]"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFieldClick(field, currentValue);
                            }}
                        >
                            <div className="inline-flex items-baseline gap-2.5 px-4 py-3 rounded-xl bg-primary/5 border-2 border-primary/20">
                                <span className="text-primary text-2xl font-bold">$</span>
                                <span className="text-xl font-bold text-foreground">{displayValue.replace('$', '').trim()}</span>
                            </div>
                        </button>
                    </div>
                );
            }

            return (
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
                        <div className="p-1.5 rounded-lg bg-muted/50">
                            {icon}
                        </div>
                        <span>{label}</span>
                    </div>
                    <button
                        className="w-full text-left text-base text-foreground hover:text-primary active:scale-[0.98] transition-all duration-150 cursor-pointer p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent flex items-center justify-between group/field border-2 border-transparent hover:border-primary/20 active:bg-primary/10 min-h-[56px]"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleFieldClick(field, currentValue);
                        }}
                    >
                        <span className="flex-1 font-semibold text-base">{displayValue || <span className="text-muted-foreground/50 italic font-normal">—</span>}</span>
                        <Edit2 className="h-5 w-5 opacity-0 group-hover/field:opacity-60 transition-opacity text-primary shrink-0" />
                    </button>
                </div>
            );
        }


        if (inputType === 'select') {
            return (
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
                        <div className="p-1.5 rounded-lg bg-muted/50">
                            {icon}
                        </div>
                        <span>{label}</span>
                    </div>
                    <div className="flex gap-3">
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
                            <SelectTrigger className="flex-1 rounded-xl border-2 h-12 text-base">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="individual">Persona</SelectItem>
                                <SelectItem value="company">Compañía</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="ghost"
                            size="lg"
                            onClick={handleCancel}
                            className="h-12 w-12 p-0 rounded-xl hover:bg-destructive/10 hover:text-destructive min-w-[48px]"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            );
        }

        if (inputType === 'date') {
            return (
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
                        <div className="p-1.5 rounded-lg bg-muted/50">
                            {icon}
                        </div>
                        <span>{label}</span>
                    </div>
                    <div className="flex gap-3">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex-1 justify-start text-left font-normal rounded-xl border-2 h-12 text-base"
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
                            size="lg"
                            onClick={handleCancel}
                            className="h-12 w-12 p-0 rounded-xl hover:bg-destructive/10 hover:text-destructive min-w-[48px]"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            );
        }

        if (inputType === 'currency') {
            return (
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
                        <div className="p-1.5 rounded-lg bg-muted/50">
                            {icon}
                        </div>
                        <span>{label}</span>
                    </div>
                    <div className="flex gap-3 items-center">
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
                            className="flex-1 rounded-xl border-2 h-12 text-base"
                            placeholder="0.00"
                        />
                        <span className="text-base text-muted-foreground self-center px-4 py-3 rounded-xl bg-muted/50 font-semibold whitespace-nowrap">DOP</span>
                        <Button
                            variant="ghost"
                            size="lg"
                            onClick={() => handleSave(field)}
                            className="h-12 w-12 p-0 rounded-xl hover:bg-primary/10 hover:text-primary border-2 border-transparent hover:border-primary/20 min-w-[48px]"
                        >
                            <Check className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="lg"
                            onClick={handleCancel}
                            className="h-12 w-12 p-0 rounded-xl hover:bg-destructive/10 hover:text-destructive min-w-[48px]"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            );
        }

        if (inputType === 'textarea' || field === 'notes') {
            return (
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
                        <div className="p-1.5 rounded-lg bg-muted/50">
                            {icon}
                        </div>
                        <span>{label}</span>
                    </div>
                    <div className="space-y-4">
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
                            className="flex w-full rounded-xl border-2 border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none min-h-[140px]"
                            rows={5}
                            placeholder="Agregar notas..."
                        />
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleCancel}
                                className="rounded-xl border-2 min-h-[48px] px-6"
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => handleSave(field)}
                                className="rounded-xl shadow-md hover:shadow-lg transition-shadow min-h-[48px] px-6"
                            >
                                Guardar
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
                    <div className="p-1.5 rounded-lg bg-muted/50">
                        {icon}
                    </div>
                    <span>{label}</span>
                </div>
                <div className="flex gap-3 items-center">
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
                        className="flex-1 rounded-xl border-2 h-12 text-base"
                    />
                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => handleSave(field)}
                        className="h-12 w-12 p-0 rounded-xl hover:bg-primary/10 hover:text-primary border-2 border-transparent hover:border-primary/20 min-w-[48px]"
                    >
                        <Check className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={handleCancel}
                        className="h-12 w-12 p-0 rounded-xl hover:bg-destructive/10 hover:text-destructive min-w-[48px]"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary overflow-hidden group bg-gradient-to-br from-card via-card/95 to-card/90 active:scale-[0.99]">
            <CardContent className="p-6 md:p-7 space-y-6">
                {/* Header con nombre y acciones */}
                <div className="flex items-start justify-between gap-4 pb-5 border-b-2 border-primary/20">
                    <div className="flex-1 min-w-0">
                        {editingField === 'name' ? (
                            renderEditableField('name', 'Nombre', client.name, <User className="h-4 w-4" />, 'text')
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2.5 text-xs font-bold text-primary/70 uppercase tracking-wider">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <span>Nombre</span>
                                </div>
                                <button
                                    className="w-full text-left cursor-pointer group/name active:scale-[0.98]"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFieldClick('name', client.name);
                                    }}
                                >
                                    <h3 className="text-2xl font-bold text-foreground hover:text-primary transition-colors group-hover/name:text-primary">
                                        {client.name || <span className="text-muted-foreground/50 italic">—</span>}
                                    </h3>
                                </button>
                            </div>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => onDelete(client)}
                        className="shrink-0 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 opacity-50 group-hover:opacity-100 rounded-xl hover:scale-110 active:scale-95 min-w-[48px] min-h-[48px]"
                    >
                        <Trash2 className="h-5 w-5" />
                    </Button>
                </div>


                <div className="grid grid-cols-1 gap-6">
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

                    <div className="grid grid-cols-2 gap-6">
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

