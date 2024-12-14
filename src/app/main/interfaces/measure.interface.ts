export interface Measure {
    id?: number
    startDate: Date
    height: number
    weight: number
    shoulder: number
    chest: number
    arm: number
    waist: number
    hip: number
    leg: number
    bmi?: number
    bmiStatus?: string
    waistToHipRatio?: number
    waistToHeightRatio?: number

}
