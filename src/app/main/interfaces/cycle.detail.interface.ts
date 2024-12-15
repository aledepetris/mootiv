export interface CycleDetail {
    id?: number;
    startDate: Date;
    endDate?: Date;
    status?: string;
    numberOfWeeks: number;
    numberOfDays: number;
    idTrainingType: number;
    idGoal: number;
    trainingWeeks: TrainingWeek[]
}

export interface TrainingWeek {
    id?: number,
    startDate: Date,
    days: TrainingDay[],
    status: string;
}

export interface TrainingDay {
    id?: number,
    finishDate: Date,
    exercises: ExerciseRoutine[],
    status: string;
}

export interface ExerciseRoutine {
    id?: number;
    exercise: ExerciseDetail,
    sets: number,
    repetitions: number,
    weight: number,
    rest: number,
    notes: number,
}

export interface ExerciseDetail {
    id?: number,
    name: string,
    description: string,
    alt_img: string,
    isForTime: boolean,
    isTotal: boolean,
}
