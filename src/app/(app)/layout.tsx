import { auth } from "@/auth.config";
import { routes } from "@/router/routes";
import { redirect } from "next/navigation";


export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session?.user) {
        redirect(routes.home);
    }
    return <>{children}</>;
}