import { redirect } from 'next/navigation';
import { auth } from '@/auth.config';
import { getUserWorkspaces } from '@/lib/actions/workspaces/get-workspaces';
import WorkspacesPageClient from '@/components/ui/workspaces/WorkspacesPageClient';
import { routes } from '@/router/routes';

export default async function WorkspacesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect(routes.home);
  }

  const workspaces = await getUserWorkspaces();
  console.log('workspaces', workspaces);

  return <WorkspacesPageClient workspaces={workspaces} />;
}
