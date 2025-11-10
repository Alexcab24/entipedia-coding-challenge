import { auth } from "@/auth.config";
import { redirect } from "next/navigation";


export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    console.log('session', session?.user);
    if (!session?.user) {
        redirect('/');
    }
    return <>{children}</>;
}