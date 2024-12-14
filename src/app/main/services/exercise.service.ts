import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Exercise } from '../interfaces/exercise.interface';


@Injectable({ providedIn: 'root' })
export class ExercisesService {

    private baseUrl: string = environment.baseUrl;
    private basePath: string = '/exercise'

    constructor(private http: HttpClient) { }

    getExercises(): Observable<Exercise[]> {
        return this.http.get<Exercise[]>(
            `${this.baseUrl + this.basePath}`
        )
    }

    getExerciseById(id: number): Observable<Exercise | undefined> {
        return this.http.get<Exercise>(
            `${this.baseUrl + this.basePath}/${id}`
        )
    }

    postExercise(exercise: Exercise): Observable<Exercise> {
        return this.http.post<Exercise>(`${this.baseUrl + this.basePath}`, exercise);
    }

    updateExercise(id: number, exercise: Exercise): Observable<any> {
        return this.http.put(`${this.baseUrl + this.basePath}/${id}`, exercise);
    }

    deleteExercise(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl + this.basePath}/${id}`);
    }

}
