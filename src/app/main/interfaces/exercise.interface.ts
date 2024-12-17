export interface Exercise {
    id?: number;
    alt_img?: string;
    name: string;
    description: string;
    forTime: boolean;
    total: boolean;
    idsMuscles?: number[];
    idsExercisesType?: number[];
    idsEquipments?: number[];
}
