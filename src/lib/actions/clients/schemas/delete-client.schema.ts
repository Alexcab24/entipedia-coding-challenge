import { z } from "zod";

export const deleteClientSchema = z.object({
    clientId: z
        .string()
        .uuid('ID de cliente inválido'),
});

export type DeleteClientSchema = z.infer<typeof deleteClientSchema>;

