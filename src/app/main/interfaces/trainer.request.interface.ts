export interface TrainerRequest {
    dni: number | null;
    name: string;
    lastName: string;
    email: string;
    telephone: string;
    birthdate: Date | null;
    active: boolean;
    idsStudents: number[];
  }
