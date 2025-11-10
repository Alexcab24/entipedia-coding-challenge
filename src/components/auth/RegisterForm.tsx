'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Mail, Lock, User } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

interface UserData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof UserData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement validation and registration logic
    console.log('User registration:', userData);
    // Después del registro exitoso, redirigir a la página de workspaces
    router.push('/workspaces');
  };

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

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="fullName"
          name="fullName"
          label="Nombre completo"
          type="text"
          placeholder="Juan Pérez García"
          value={userData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          icon={<User className="h-5 w-5" />}
          required
        />

        <Input
          id="email"
          name="email"
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.com"
          value={userData.email}
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
          value={userData.password}
          onChange={handleChange}
          error={errors.password}
          icon={<Lock className="h-5 w-5" />}
          required
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          value={userData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          icon={<Lock className="h-5 w-5" />}
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
            <a href="#" className="text-black hover:text-black/80 hover:underline transition-all duration-200 cursor-pointer">
              términos y condiciones
            </a>{' '}
            y la{' '}
            <a href="#" className="text-black hover:text-black/80 hover:underline transition-all duration-200 cursor-pointer">
              política de privacidad
            </a>
          </label>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full">
          Crear cuenta
        </Button>
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
