export interface Cycle {
    id?: number;
    startDate: Date;
    endDate?: Date;
    status?: string;
    numberOfWeeks: number;
    numberOfDays: number;
    idTrainingType: number;
    idGoal: number;
}
