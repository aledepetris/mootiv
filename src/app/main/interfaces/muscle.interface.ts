export interface Muscle {
    id?: number;
    idParentMuscle?: number;
    alt_img?: string;
    name: string;
    muscles: Muscle[];
    exercises?: string[];
}
