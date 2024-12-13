import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TrainingType } from '../interfaces/training-type.interface';


@Injectable({ providedIn: 'root' })
export class TrainingTypesService {

    private baseUrl: string = environment.baseUrl;
    private basePath: string = '/training-type'

    constructor(private http: HttpClient) { }

    getTrainingTypes(): Observable<TrainingType[]> {
        return this.http.get<TrainingType[]>(
            `${this.baseUrl + this.basePath}`
        )
    }

    getTrainingTypeById(id: number): Observable<TrainingType | undefined> {
        return this.http.get<TrainingType>(
            `${this.baseUrl + this.basePath}/${id}`
        )
    }

    postTrainingType(trainingType: TrainingType): Observable<TrainingType> {
        return this.http.post<TrainingType>(`${this.baseUrl + this.basePath}`, trainingType);
    }

    updateTrainingType(id: number, trainingType: TrainingType): Observable<any> {
        return this.http.put(`${this.baseUrl + this.basePath}/${id}`, trainingType);
    }

    deleteTrainingType(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl + this.basePath}/${id}`);
    }


}
