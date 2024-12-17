export interface Student {
    id?: string;
    alt_img?: string;
    name: string;
    lastName: string;
    email: string;
    dni: number | null;
    telephone: string;
    active?: boolean;
    birthdate: Date | null;
    startDate: Date | null;
}
