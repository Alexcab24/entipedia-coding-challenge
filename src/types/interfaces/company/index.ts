export interface Company {
    id: string;
    name: string;
    workspace: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}
