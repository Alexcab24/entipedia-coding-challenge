import { z } from "zod";



export const sendInvitationSchema = z.object({
    email: z.string().email('Correo electrónico inválido'),
    companyId: z.string().uuid('ID de empresa inválido'),
});
