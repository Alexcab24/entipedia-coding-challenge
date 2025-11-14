'use client';

import { useState, useEffect } from 'react';
import {
    Settings,
    Building2,
    Moon,
    Sun,
    UserPlus,
    Save,
    Globe,
    AlertCircle,
    Info,
    Mail,
    X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import Input from '../Input';
import Button from '../Button';
import { cn } from '@/lib/utils';

interface Company {
    id: string;
    name: string;
    workspace: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface SettingsPageProps {
    company: Company;
}

type SettingsSection = 'general' | 'appearance' | 'invite';

export default function SettingsPage({ company }: SettingsPageProps) {
    const [activeSection, setActiveSection] = useState<SettingsSection>('general');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [formData, setFormData] = useState({
        name: company.name,
        description: company.description || '',
    });
    const [inviteEmail, setInviteEmail] = useState('');
    const [invitedEmails, setInvitedEmails] = useState<string[]>([]);


    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsDarkMode(isDark);
    }, []);

    const handleToggleTheme = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);

        if (newDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddInviteEmail = () => {
        if (inviteEmail.trim() && !invitedEmails.includes(inviteEmail.trim())) {
            setInvitedEmails((prev) => [...prev, inviteEmail.trim()]);
            setInviteEmail('');
        }
    };

    const handleRemoveInviteEmail = (email: string) => {
        setInvitedEmails((prev) => prev.filter((e) => e !== email));
    };

    const handleInviteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleAddInviteEmail();
    };

    const sections = [
        {
            id: 'general' as SettingsSection,
            label: 'Información General',
            icon: Building2,
            description: 'Configura los detalles básicos',
        },
        {
            id: 'appearance' as SettingsSection,
            label: 'Apariencia',
            icon: Sun,
            description: 'Personaliza la interfaz',
        },
        {
            id: 'invite' as SettingsSection,
            label: 'Invitar Usuarios',
            icon: UserPlus,
            description: 'Añade miembros al workspace',
        },
    ];

    const renderGeneralSection = () => (
        <div className="space-y-6">
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

    const renderAppearanceSection = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                    Tema de la Aplicación
                </h3>
                <p className="text-sm text-muted-foreground">
                    Elige entre modo claro u oscuro
                </p>
            </div>

            <Card className="border-border/60">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "p-3 rounded-lg transition-colors",
                                isDarkMode ? "bg-muted" : "bg-primary/10"
                            )}>
                                {isDarkMode ? (
                                    <Moon className="h-5 w-5 text-primary" />
                                ) : (
                                    <Sun className="h-5 w-5 text-primary" />
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-foreground">
                                    Modo {isDarkMode ? 'Oscuro' : 'Claro'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {isDarkMode
                                        ? 'Interfaz con colores oscuros para reducir la fatiga visual'
                                        : 'Interfaz con colores claros, ideal para uso diurno'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleToggleTheme}
                            className={cn(
                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                isDarkMode ? "bg-primary" : "bg-secondary"
                            )}
                            aria-label="Toggle theme"
                        >
                            <span
                                className={cn(
                                    "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                                    isDarkMode ? "translate-x-6" : "translate-x-1"
                                )}
                            />
                        </button>
                    </div>
                </CardContent>
            </Card>

            <div className="rounded-lg border border-border/60 bg-muted/30 p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Sobre los temas</p>
                    <p>
                        El tema se guarda en tu navegador y se aplicará automáticamente en futuras visitas.
                    </p>
                </div>
            </div>
        </div>
    );

    const renderInviteSection = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                    Invitar Usuarios al Workspace
                </h3>
                <p className="text-sm text-muted-foreground">
                    Añade miembros a tu workspace invitándolos por correo electrónico
                </p>
            </div>

            <Card className="border-border/60">
                <CardContent className="p-6">
                    <form onSubmit={handleInviteSubmit} className="space-y-4">
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <Input
                                    id="invite-email"
                                    label="Correo Electrónico"
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="usuario@ejemplo.com"
                                    icon={<Mail className="h-4 w-4" />}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={!inviteEmail.trim()}
                                >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Agregar
                                </Button>
                            </div>
                        </div>
                    </form>

                    {invitedEmails.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-border">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-foreground">
                                        Correos a invitar ({invitedEmails.length})
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setInvitedEmails([]);
                                        }}
                                    >
                                        Limpiar todo
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {invitedEmails.map((email) => (
                                        <div
                                            key={email}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm text-foreground"
                                        >
                                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span>{email}</span>
                                            <button
                                                onClick={() => handleRemoveInviteEmail(email)}
                                                className="ml-1 hover:bg-secondary rounded-full p-0.5 transition-colors"
                                                aria-label={`Remover ${email}`}
                                            >
                                                <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {invitedEmails.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-border">
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full"
                            >
                                <Mail className="h-4 w-4 mr-2" />
                                Enviar Invitaciones ({invitedEmails.length})
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="rounded-lg border border-border/60 bg-muted/30 p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Sobre las invitaciones</p>
                    <p>
                        Los usuarios recibirán un correo electrónico con un enlace para unirse al workspace.
                        Puedes agregar múltiples correos electrónicos antes de enviar las invitaciones.
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full space-y-8 pb-8">
            {/* Header Section */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <Settings className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">
                            Configuración
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Gestiona la configuración de tu workspace
                        </p>
                    </div>
                </div>
            </div>

            {/* Settings Content */}
            <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
                {/* Sidebar Navigation */}
                <Card className="border-border/60 shadow-md lg:h-fit">
                    <CardContent className="p-4">
                        <nav className="space-y-1">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                const isActive = activeSection === section.id;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                        )}
                                    >
                                        <Icon className={cn(
                                            "h-5 w-5",
                                            isActive ? "text-primary-foreground" : "text-muted-foreground"
                                        )} />
                                        <div className="flex-1 text-left">
                                            <div className={cn(
                                                isActive && "text-primary-foreground"
                                            )}>
                                                {section.label}
                                            </div>
                                            <div className={cn(
                                                "text-xs mt-0.5",
                                                isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                                            )}>
                                                {section.description}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </nav>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <Card className="border-border/60 shadow-md">
                    <CardHeader className="bg-gradient-to-r from-primary/60 via-primary/50 to-primary/60 backdrop-blur-md border-b-2 border-primary/30">
                        <div className="flex items-center gap-3">
                            {(() => {
                                const SectionIcon = sections.find(s => s.id === activeSection)?.icon || Settings;
                                return (
                                    <div className="p-2 rounded-lg bg-primary-foreground/20">
                                        <SectionIcon className="h-6 w-6 text-primary-foreground" />
                                    </div>
                                );
                            })()}
                            <div>
                                <CardTitle className="text-2xl font-bold text-primary-foreground">
                                    {sections.find(s => s.id === activeSection)?.label}
                                </CardTitle>
                                <CardDescription className="text-primary-foreground/80 mt-1">
                                    {sections.find(s => s.id === activeSection)?.description}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {activeSection === 'general' && renderGeneralSection()}
                        {activeSection === 'appearance' && renderAppearanceSection()}
                        {activeSection === 'invite' && renderInviteSection()}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
