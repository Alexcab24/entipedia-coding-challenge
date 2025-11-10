'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, Lock, Loader2, MailCheck } from 'lucide-react';
import { authenticate } from '@/lib/actions/auth/login';
import { resendVerificationEmail } from '@/lib/actions/auth/resendVerification';


interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(authenticate, undefined);

  useEffect(() => {
    if (state === 'Success') {
      router.push('/workspaces');
    }
  }, [state, router]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [resendMessage, setResendMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (resendMessage) {
      setResendMessage(null);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setResendMessage({ type: 'error', text: 'Por favor, ingresa tu correo electrónico primero.' });
      return;
    }

    setIsResendingEmail(true);
    setResendMessage(null);

    const result = await resendVerificationEmail(formData.email);

    setIsResendingEmail(false);
    setResendMessage({
      type: result.ok ? 'success' : 'error',
      text: result.message || 'Ocurrió un error al reenviar el correo.',
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Bienvenido
        </h1>
        <p className="text-sm text-muted-foreground">
          Inicia sesión para acceder a tu empresa
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        {state && state !== 'Success' && typeof state === 'string' && (
          <div className={`rounded-lg border p-4 text-sm ${state === 'EMAIL_NOT_VERIFIED'
            ? 'border-yellow-500/40 bg-yellow-50 text-yellow-900'
            : 'border-destructive/40 bg-destructive/10 text-destructive'
            }`}>
            <div className="flex items-start gap-2">
              <span className={`font-semibold ${state === 'EMAIL_NOT_VERIFIED' ? 'text-yellow-600' : 'text-destructive'}`}>•</span>
              <div className="flex-1">
                <p className="font-medium mb-1">
                  {state === 'EMAIL_NOT_VERIFIED' ? 'Correo no verificado' : 'Error al iniciar sesión'}
                </p>
                {state === 'EMAIL_NOT_VERIFIED' ? (
                  <div className="space-y-3">
                    <p>
                      Tu correo electrónico no está verificado. Por favor, verifica tu correo antes de iniciar sesión.
                    </p>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={isResendingEmail || !formData.email}
                        className="flex items-center justify-center gap-2 text-sm font-medium text-yellow-900 bg-yellow-100 hover:bg-yellow-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isResendingEmail ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <MailCheck className="h-4 w-4" />
                            Reenviar correo de verificación
                          </>
                        )}
                      </button>
                      {resendMessage && (
                        <p className={`text-xs ${resendMessage.type === 'success'
                          ? 'text-green-700'
                          : 'text-red-700'
                          }`}>
                          {resendMessage.text}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p>{state}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <Input
          id="email"
          name="email"
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={<Mail className="h-5 w-5" />}
          required
        />

        <Input
          id="password"
          name="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={<Lock className="h-5 w-5" />}
          showPasswordToggle
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-input text-primary focus:ring-2 focus:ring-ring"
            />
            <span className="ml-2 text-sm text-muted-foreground">
              Recordarme
            </span>
          </label>
          <a
            href="/forgot-password"
            className="text-sm text-black hover:text-black/80 hover:underline transition-all duration-200 cursor-pointer"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full cursor-pointer hover:bg-primary/90 transition-all duration-200">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Iniciar sesión'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          ¿No tienes una cuenta?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-black font-medium hover:text-black/80 hover:underline transition-all duration-200 cursor-pointer"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

