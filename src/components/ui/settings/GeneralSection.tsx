'use client';

import { useState } from 'react';
import { Building2, Globe, AlertCircle, Save } from 'lucide-react';
import Input from '../Input';
import Button from '../Button';
import { cn } from '@/lib/utils';

interface GeneralSectionProps {
    company: {
        id: string;
        name: string;
        workspace: string;
        description: string | null;
    };
}

export default function GeneralSection({ company }: GeneralSectionProps) {
    const [formData, setFormData] = useState({
        name: company.name,
        description: company.description || '',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6 rounded-lg">
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                    Información del Workspace
                </h3>
                <p className="text-sm text-muted-foreground">
                    Actualiza la información básica de tu workspace
                </p>
            </div>

            <div className="space-y-4">
                <Input
                    id="name"
                    label="Nombre del Workspace"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: Mi Empresa"
                    icon={<Building2 className="h-4 w-4" />}
                />

                <div className="space-y-2">
                    <Input
                        id="workspace"
                        label="Workspace URL"
                        value={company.workspace}
                        placeholder="mi-workspace"
                        icon={<Globe className="h-4 w-4" />}
                        disabled
                    />
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5" />
                        El workspace URL no puede ser modificado
                    </p>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-foreground"
                    >
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe tu workspace (opcional)"
                        rows={4}
                        maxLength={500}
                        className={cn(
                            'flex w-full rounded-lg border border-secondary bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none'
                        )}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                        {formData.description.length}/500 caracteres
                    </p>
                </div>
            </div>

            <div className="pt-4 border-t border-border">
                <Button variant="primary" size="lg">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                </Button>
            </div>
        </div>
    );
}
