import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ExerciseType } from '../interfaces/exercise-type.interface';


@Injectable({ providedIn: 'root' })
export class ExerciseTypesService {

    private baseUrl: string = environment.baseUrl;
    private basePath: string = '/exercise-type'

    constructor(private http: HttpClient) { }

    getExerciseTypes(): Observable<ExerciseType[]> {
        return this.http.get<ExerciseType[]>(
            `${this.baseUrl + this.basePath}`
        )
    }

    getExerciseTypeById(id: number): Observable<ExerciseType | undefined> {
        return this.http.get<ExerciseType>(
            `${this.baseUrl + this.basePath}/${id}`
        )
    }

    postExerciseType(exerciseType: ExerciseType): Observable<ExerciseType> {
        return this.http.post<ExerciseType>(`${this.baseUrl + this.basePath}`, exerciseType);
    }

    updateExerciseType(id: number, exerciseType: ExerciseType): Observable<any> {
        return this.http.put(`${this.baseUrl + this.basePath}/${id}`, exerciseType);
    }

    deleteExerciseType(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl + this.basePath}/${id}`);
    }


}
