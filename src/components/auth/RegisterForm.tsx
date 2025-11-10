'use client';

import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { registerUser } from '@/lib/actions/auth/register';
import { registerInitialState } from '@/lib/actions/auth/register.types';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="primary"
      size="lg"
      className="w-full cursor-pointer hover:bg-primary/90 transition-all duration-200"
      disabled={pending}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Crear cuenta'}
    </Button>
  );
};

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [state, formAction] = useActionState(registerUser, registerInitialState);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Crear cuenta
        </h1>
        <p className="text-sm text-muted-foreground">
          Regístrate para comenzar a usar Entipedia
        </p>
      </div>

      <form action={formAction} className="space-y-6" noValidate>
        {state.status === 'error' && state.message && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            <div className="flex items-start gap-2">
              <span className="text-destructive font-semibold">•</span>
              <div>
                <p className="font-medium mb-1">Error al crear la cuenta</p>
                <p>{state.message}</p>
              </div>
            </div>
          </div>
        )}

        <Input
          id="fullName"
          name="fullName"
          label="Nombre completo"
          type="text"
          placeholder="Juan Pérez García"
          defaultValue={state.values?.fullName ?? ''}
          autoComplete="name"
          icon={<User className="h-5 w-5" />}
          error={state.fieldErrors?.fullName}
          required
        />

        <Input
          id="email"
          name="email"
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.com"
          defaultValue={state.values?.email ?? ''}
          autoComplete="email"
          icon={<Mail className="h-5 w-5" />}
          error={state.fieldErrors?.email}
          required
        />

        <Input
          id="password"
          name="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          icon={<Lock className="h-5 w-5" />}
          error={state.fieldErrors?.password}
          showPasswordToggle
          required
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          icon={<Lock className="h-5 w-5" />}
          error={state.fieldErrors?.confirmPassword}
          showPasswordToggle
          required
        />

        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 rounded border-input text-primary focus:ring-2 focus:ring-ring"
            required
          />
          <label htmlFor="terms" className="ml-2 text-sm text-muted-foreground">
            Acepto los{' '}
            <a
              href="#"
              className="text-black hover:text-black/80 hover:underline transition-all duration-200 cursor-pointer"
            >
              términos y condiciones
            </a>{' '}
            y la{' '}
            <a
              href="#"
              className="text-black hover:text-black/80 hover:underline transition-all duration-200 cursor-pointer"
            >
              política de privacidad
            </a>
          </label>
        </div>

        <SubmitButton />
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-black font-medium hover:text-black/80 hover:underline transition-all duration-200 cursor-pointer"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
