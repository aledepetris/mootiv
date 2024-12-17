import { Student } from "./student.interface";

export interface Trainer {
    id?:               number;
    alt_img?:         string;
    name:             string;
    lastName:         string;
    email:            string;
    dni:              string;
    telephone:        string;
    students:         Student[];
    active?:           boolean;
    birthdate:        string;
}
