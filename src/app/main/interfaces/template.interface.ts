import { ExerciseRoutine } from "./cycle.detail.interface"

export interface Template {
    id?: number
    name: string
    description?: string,
    creationDate?: Date
    exercises: ExerciseRoutine[]
}
