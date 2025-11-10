'use client';

import { useState } from 'react';
import Image from 'next/image';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

type ViewMode = 'login' | 'register';

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('login');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-4rem)] gap-8 lg:gap-16">
          {/* Left side - Branding/Illustration */}
          <div className="w-full lg:w-1/2 max-w-lg text-center lg:text-left">
            <div className="mb-4 lg:mb-8">
              <div className="mb-4 lg:mb-10">
                <Image
                  src="/images/EntipediaLogoBlack.png"
                  alt="Entipedia Logo"
                  width={400}
                  height={160}
                  className="mb-4 lg:mb-8 mx-auto lg:mx-0 w-full max-w-[150px] sm:max-w-[320px] lg:max-w-[400px] h-auto"
                  priority
                />
              </div>
              <h1 className="text-xl lg:text-5xl font-bold text-foreground lg:mb-4">
                Bienvenido a Entipedia
              </h1>
              <p className="text-xs lg:text-2xl text-muted-foreground mb-8">
                Gestiona proyectos, personas, entidades y reportes en una
                plataforma integral y eficiente.
              </p>

            </div>
          </div>

          {/* Right side - Auth Forms */}
          <div className="w-full lg:w-1/2 max-w-md">
            <div className="bg-card border border-border/50 rounded-2xl shadow-2xl p-6 lg:p-10 backdrop-blur-sm">
              {viewMode === 'login' ? (
                <LoginForm
                  onSwitchToRegister={() => setViewMode('register')}
                />
              ) : (
                <RegisterForm
                  onSwitchToLogin={() => setViewMode('login')}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground border-t border-border/50 mt-auto">
        <p>
          © {new Date().getFullYear()} Entipedia. Todos los derechos
          reservados.
        </p>
      </footer>
    </div>
  );
}
