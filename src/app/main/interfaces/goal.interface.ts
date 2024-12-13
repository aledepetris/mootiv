export interface Goal {
    id?: number;
    alt_img?: string;
    name: string;
    description: string;
    scheduleGoals: ScheduleGoal[];
}

export interface ScheduleGoal {
    day: string;
    idsTrainingTypes: number[];
}
