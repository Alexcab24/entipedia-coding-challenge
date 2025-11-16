'use client';

import { useState, useEffect, useActionState } from 'react';
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
    Loader2,
    RefreshCw,
    Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import Input from '../Input';
import Button from '../Button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { sendWorkspaceInvitations } from '@/lib/actions/invitations/send-workspace-invitations';
import { sendInvitationsInitialState } from '@/lib/actions/invitations/send-workspace-invitations.types';
import { getPendingInvitations } from '@/lib/actions/invitations/get-pending-invitations';
import { PendingInvitation } from '@/types/interfaces/invitation';
import { cancelInvitation } from '@/lib/actions/invitations/cancel-invitation';
import { resendInvitation } from '@/lib/actions/invitations/resend-invitation';
import { SettingsPageProps } from '@/types/interfaces/settings';



type SettingsSection = 'general' | 'appearance' | 'invite';

export default function SettingsPage({ company }: SettingsPageProps) {
    const [activeSection, setActiveSection] = useState<SettingsSection>('general');
    const { toggleTheme, isDark } = useTheme();
    const [formData, setFormData] = useState({
        name: company.name,
        description: company.description || '',
    });
    const [inviteEmail, setInviteEmail] = useState('');
    const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
    const [loadingInvitations, setLoadingInvitations] = useState(false);
    const [state, formAction, isPending] = useActionState(
        sendWorkspaceInvitations,
        sendInvitationsInitialState
    );

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };


    useEffect(() => {
        if (activeSection === 'invite') {
            loadPendingInvitations();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSection, company.id]);

    const loadPendingInvitations = async () => {
        setLoadingInvitations(true);
        try {
            const invitations = await getPendingInvitations(company.id);
            setPendingInvitations(invitations);
        } catch (error) {
            console.error('Failed to load pending invitations:', error);
        } finally {
            setLoadingInvitations(false);
        }
    };

    const handleCancelInvitation = async (invitationId: string) => {
        const result = await cancelInvitation(invitationId);
        if (result.success) {
            await loadPendingInvitations();
        } else {
            alert(result.message);
        }
    };

    const handleResendInvitation = async (invitationId: string) => {
        const result = await resendInvitation(invitationId);
        if (result.success) {
            await loadPendingInvitations();
        } else {
            alert(result.message);
        }
    };


    useEffect(() => {
        if (state.status === 'success' && state.message) {
            setInviteEmail('');
            loadPendingInvitations();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.status]);

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

    const renderAppearanceSection = () => (
        <div className="space-y-6 rounded-lg">
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
                                isDark ? "bg-muted" : "bg-primary/10"
                            )}>
                                {isDark ? (
                                    <Moon className="h-5 w-5 text-primary" />
                                ) : (
                                    <Sun className="h-5 w-5 text-primary" />
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-foreground">
                                    Modo {isDark ? 'Oscuro' : 'Claro'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {isDark
                                        ? 'Interfaz con colores oscuros para reducir la fatiga visual'
                                        : 'Interfaz con colores claros, ideal para uso diurno'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={cn(
                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
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
                    <form action={formAction} className="space-y-4">
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <Input
                                    id="invite-email"
                                    label="Correo Electrónico"
                                    type="email"
                                    name="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="usuario@ejemplo.com"
                                    icon={<Mail className="h-4 w-4" />}
                                    disabled={isPending}
                                />
                            </div>
                            <div className="flex items-end">
                                <input type="hidden" name="companyId" value={company.id} />
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={!inviteEmail.trim() || isPending}
                                >
                                    {isPending ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <UserPlus className="h-4 w-4 mr-2" />
                                    )}
                                    Enviar Invitación
                                </Button>
                            </div>
                        </div>
                    </form>

                    {state.status === 'error' && state.message && (
                        <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                            {state.message}
                        </div>
                    )}

                    {state.status === 'success' && state.message && (
                        <div className="mt-4 rounded-lg border border-green-500/40 bg-green-50 p-3 text-sm text-green-900">
                            {state.message}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pending Invitations */}
            <Card className="border-border/60">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Invitaciones Pendientes</CardTitle>
                            <CardDescription>
                                Gestiona las invitaciones enviadas que aún no han sido aceptadas
                            </CardDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={loadPendingInvitations}
                            disabled={loadingInvitations}
                        >
                            <RefreshCw className={cn("h-4 w-4", loadingInvitations && "animate-spin")} />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingInvitations ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : pendingInvitations.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No hay invitaciones pendientes</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingInvitations.map((invitation) => {
                                const isExpired = invitation.expiresAt < new Date();
                                return (
                                    <div
                                        key={invitation.id}
                                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium text-foreground">
                                                    {invitation.email}
                                                </span>
                                                {isExpired && (
                                                    <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                                                        Expirada
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Invitado por {invitation.inviterName || 'Usuario'} •{' '}
                                                {new Date(invitation.createdAt).toLocaleDateString('es-ES', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleResendInvitation(invitation.id)}
                                                disabled={isExpired}
                                                title="Reenviar invitación"
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleCancelInvitation(invitation.id)}
                                                title="Cancelar invitación"
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="rounded-lg border border-border/60 bg-muted/30 p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Sobre las invitaciones</p>
                    <p>
                        Los usuarios recibirán un correo electrónico con un enlace para unirse al workspace.
                        Las invitaciones expiran después de 7 días. Puedes reenviar o cancelar invitaciones pendientes.
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
                                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer",
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
                <Card className="border-border/60 shadow-md rounded-lg">
                    <CardHeader className="bg-linear-to-r from-primary/60 via-primary/50 to-primary/60 backdrop-blur-md border-b-2 border-primary/30 rounded-t-lg">
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
