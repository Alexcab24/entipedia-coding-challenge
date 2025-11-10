'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { authenticate } from '@/lib/actions/auth/login';


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
  }, [state]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement validation and login logic
    console.log('Login form submitted:', formData);
   
    router.push('/workspaces');
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
            href="#"
            className="text-sm text-black hover:text-black/80 hover:underline transition-all duration-200 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Implement forgot password
            }}
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

