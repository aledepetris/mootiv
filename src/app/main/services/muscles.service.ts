import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Muscle } from '../interfaces/muscle.interface';


@Injectable({ providedIn: 'root' })
export class MusclesService {

    private baseUrl: string = environment.baseUrl;
    private basePath: string = '/muscle'

    constructor(private http: HttpClient) { }

    getMuscles(): Observable<Muscle[]> {
        return this.http.get<Muscle[]>(
            `${this.baseUrl + this.basePath}`
        )
    }

    getMuscleById(id: string): Observable<Muscle | undefined> {
        return this.http.get<Muscle>(
            `${this.baseUrl + this.basePath}/${id}`
        )
    }

    postMuscle(muscle: Muscle): Observable<Muscle> {
        return this.http.post<Muscle>(`${this.baseUrl + this.basePath}`, muscle);
    }

    updateMuscle(id: number, muscle: Muscle): Observable<any> {
        return this.http.put(`${this.baseUrl + this.basePath}/${id}`, muscle);
    }

    deleteMuscle(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl + this.basePath}/${id}`);
    }

}
