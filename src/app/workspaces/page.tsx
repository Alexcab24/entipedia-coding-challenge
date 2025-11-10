'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Building2, ChevronRight, LogOut, Plus, X, Mail, Phone } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { logout } from '@/lib/actions/auth/logout';

interface Workspace {
  id: string;
  name: string;
  description?: string;
  membersCount?: number;
  lastAccessed?: string;
  role?: 'owner' | 'admin' | 'member';
  isInvited?: boolean;
}

export default function WorkspacesPage() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);



  // TODO: Obtener workspaces del usuario desde la API
  const [workspaces] = useState<Workspace[]>([
    
    {
      id: '1',
      name: 'Mi Empresa',
      description: 'Espacio de trabajo principal',
      membersCount: 12,
      lastAccessed: 'Hace 2 horas',
      role: 'owner',
    },
   
    {
      id: '2',
      name: 'Consultoría XYZ',
      description: 'Equipo de consultoría',
      membersCount: 8,
      lastAccessed: 'Hace 3 días',
      role: 'member',
      isInvited: true,
    },
  ]);

  const [newCompany, setNewCompany] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleSelectWorkspace = (workspaceId: string) => {
    // TODO: Guardar el workspace seleccionado y redirigir al dashboard
  
    // router.push(`/dashboard?workspace=${workspaceId}`);
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    // TODO: Implementar creación de empresa
  

  
    setTimeout(() => {
      setIsCreating(false);
      setShowCreateModal(false);
      setNewCompany({ name: '', email: '', phone: '', description: '' });
     
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const ownWorkspaces = workspaces.filter((w) => !w.isInvited);
  const invitedWorkspaces = workspaces.filter((w) => w.isInvited);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Image
              src="/images/EntipediaLogoBlack.png"
              alt="Entipedia Logo"
              width={200}
              height={80}
              className="h-auto"
              priority
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 cursor-pointer transition-all duration-500 hover:bg-primary hover:text-primary-foreground"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Tus espacios de trabajo
              </h1>
              <p className="text-lg text-muted-foreground">
                Selecciona un espacio de trabajo o crea uno nuevo
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Crear empresa
            </Button>
          </div>

          {/* Own Workspaces */}
          {ownWorkspaces.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Mis empresas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ownWorkspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    onClick={() => handleSelectWorkspace(workspace.id)}
                    className="group relative bg-card border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all duration-200 text-left"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {workspace.name}
                    </h3>
                    {workspace.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {workspace.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      {workspace.membersCount && (
                        <span>{workspace.membersCount} miembros</span>
                      )}
                      {workspace.lastAccessed && (
                        <span>{workspace.lastAccessed}</span>
                      )}
                    </div>
                    {workspace.role === 'owner' && (
                      <span className="absolute top-4 right-4 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        Propietario
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Invited Workspaces */}
          {invitedWorkspaces.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Empresas invitadas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {invitedWorkspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    onClick={() => handleSelectWorkspace(workspace.id)}
                    className="group relative bg-card border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all duration-200 text-left"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-secondary/80 transition-colors">
                        <Building2 className="h-6 w-6 text-foreground" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {workspace.name}
                    </h3>
                    {workspace.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {workspace.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      {workspace.membersCount && (
                        <span>{workspace.membersCount} miembros</span>
                      )}
                      {workspace.lastAccessed && (
                        <span>{workspace.lastAccessed}</span>
                      )}
                    </div>
                    <span className="absolute top-4 right-4 text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded">
                      Invitado
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {workspaces.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No tienes espacios de trabajo
              </h3>
              <p className="text-muted-foreground mb-6">
                Crea tu primera empresa para comenzar
              </p>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                Crear empresa
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Company Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Crear nueva empresa
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-4">
              <Input
                id="company-name"
                name="name"
                label="Nombre de la empresa"
                type="text"
                placeholder="Mi Empresa S.A."
                value={newCompany.name}
                onChange={handleChange}
                error={errors.name}
                icon={<Building2 className="h-5 w-5" />}
                required
              />

              <Input
                id="company-email"
                name="email"
                label="Correo de la empresa"
                type="email"
                placeholder="contacto@miempresa.com"
                value={newCompany.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail className="h-5 w-5" />}
                required
              />

              <Input
                id="company-phone"
                name="phone"
                label="Teléfono"
                type="tel"
                placeholder="+1 234 567 8900"
                value={newCompany.phone}
                onChange={handleChange}
                error={errors.phone}
                icon={<Phone className="h-5 w-5" />}
                required
              />

              <div className="w-full">
                <label
                  htmlFor="company-description"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Descripción (opcional)
                </label>
                <textarea
                  id="company-description"
                  name="description"
                  value={newCompany.description}
                  onChange={handleChange}
                  placeholder="Breve descripción de la empresa..."
                  rows={3}
                  className="flex w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                  disabled={isCreating}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  isLoading={isCreating}
                >
                  Crear empresa
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


