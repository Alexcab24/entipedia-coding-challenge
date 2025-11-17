'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

type ViewMode = 'login' | 'register';

export default function Home() {
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get('reset') === 'success';
  const loginParam = searchParams.get('login');
  const registerParam = searchParams.get('register');
  const invitationToken = searchParams.get('invitation');

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (registerParam === 'true') return 'register';
    if (loginParam === 'true') return 'login';
    return 'login';
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col-reverse  lg:flex-row items-center justify-center gap-2 lg:gap-12 xl:gap-16">
          {/* Left side - Branding/Illustration */}
          <div className="w-full lg:w-1/2 max-w-lg text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="flex justify-center lg:justify-start">
                <Image
                  src="/images/EntipediaLogoBlack.png"
                  alt="Entipedia Logo"
                  width={400}
                  height={160}
                  className="w-full max-w-[180px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px] xl:max-w-[400px] h-auto"
                  priority
                />
              </div>
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                  Bienvenido a <span className="text-primary">Entipedia</span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-muted-foreground leading-relaxed">
                  Gestiona proyectos, personas, entidades y reportes en una
                  plataforma integral y eficiente.
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Auth Forms */}
          <div className="w-full lg:w-1/2 max-w-md order-1 lg:order-2">
            <div className="bg-card border border-border/50 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 backdrop-blur-sm">
              {resetSuccess && (
                <div className="mb-4 sm:mb-6 rounded-lg border border-green-500/40 bg-green-50 p-3 sm:p-4 text-xs sm:text-sm text-green-900">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-semibold shrink-0">✓</span>
                    <div>
                      <p className="font-medium mb-1">Contraseña restablecida</p>
                      <p className="text-xs sm:text-sm">Tu contraseña ha sido actualizada exitosamente. Ahora puedes iniciar sesión.</p>
                    </div>
                  </div>
                </div>
              )}
              {viewMode === 'login' ? (
                <LoginForm
                  onSwitchToRegister={() => setViewMode('register')}
                  invitationToken={invitationToken || undefined}
                />
              ) : (
                <RegisterForm
                  onSwitchToLogin={() => setViewMode('login')}
                  invitationToken={invitationToken || undefined}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
