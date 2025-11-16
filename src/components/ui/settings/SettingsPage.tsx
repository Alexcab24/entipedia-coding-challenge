'use client';

import { useState } from 'react';
import { Settings, Building2, Sun, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card';
import { cn } from '@/lib/utils';
import { SettingsPageProps } from '@/types/interfaces/settings';
import GeneralSection from './GeneralSection';
import AppearanceSection from './AppearanceSection';
import InviteSection from './InviteSection';



type SettingsSection = 'general' | 'appearance' | 'invite';

export default function SettingsPage({ company }: SettingsPageProps) {
    const [activeSection, setActiveSection] = useState<SettingsSection>('general');

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

    return (
        <div className="w-full space-y-8 pb-8 transition-all duration-500">
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
            <div className="grid gap-6 lg:grid-cols-[250px_1fr] transition-all duration-500">
                {/* Sidebar Navigation */}
                <Card className="border-border/60 shadow-md lg:h-fit transition-all duration-500">
                    <CardContent className="p-4 transition-all duration-500 ">
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
                    <CardContent className="p-6 transition-all duration-500">
                        {activeSection === 'general' && <GeneralSection company={company} />}
                        {activeSection === 'appearance' && <AppearanceSection />}
                        {activeSection === 'invite' && <InviteSection companyId={company.id} />}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
