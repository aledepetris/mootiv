import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cycle } from '../interfaces/cycle.interface';
import { CycleDetail, ExerciseDetail, ExerciseRoutine } from '../interfaces/cycle.detail.interface';
import { Template } from '../interfaces/template.interface';

@Injectable({ providedIn: 'root' })
export class StudentCycleService {

    private baseUrl: string = environment.baseUrl;
    private rootPath: string = '/student'
    private basePath: string = '/cycle'

    constructor(private http: HttpClient) { }

    getCycles(idStudent: number): Observable<Cycle[]> {
        return this.http.get<Cycle[]>(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}`
        );
    }

    getCycleById(idStudent: number, idCycle: number): Observable<Cycle> {
        return this.http.get<Cycle>(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}/${idCycle}`
        );
    }

    postCycle(idStudent: number, place: Cycle): Observable<Cycle> {
        return this.http.post<Cycle>(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}`,
            place
        );
    }

    updateCycle(idStudent: number, idCycle: number, place: Cycle): Observable<any> {
        return this.http.put(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}/${idCycle}`,
            place
        );
    }

    deleteCycle(idStudent: number, idCycle: number): Observable<any> {
        return this.http.delete(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}/${idCycle}`
        );
    }

    updateCycleStatus(idStudent: number, idCycle: number, status: string): Observable<any> {
        return this.http.put(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}/${idCycle}/${status}`, null
        );
    }

    getCycleDetailById(idStudent: number, idCycle: number): Observable<CycleDetail> {
        return this.http.get<CycleDetail>(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}/${idCycle}/detail`
        );
    }

    getAvailableExercises(idStudent: number, idCycle: number): Observable<ExerciseDetail[]> {
        return this.http.get<ExerciseDetail[]>(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}/${idCycle}/exercise`
        );
    }

    saveDayExercises(idStudent: number, idDay: number, payload: { exercises: any[] }): Observable<any> {
        return this.http.put(
            `${this.baseUrl + this.rootPath}/${idStudent}/day/${idDay}`,
            payload // Cambiado para aceptar un objeto con la clave "exercises"
        );
    }

    finishDay(idStudent: number, idDay: number): Observable<any> {
        return this.http.put(
            `${this.baseUrl + this.rootPath}/${idStudent}/day/${idDay}/finish`, null);
    }

    updateWeekStatus(idStudent: number, idWeek: number, status: string): Observable<any> {
        return this.http.put(
            `${this.baseUrl + this.rootPath}/${idStudent}/week/${idWeek}/${status}`, null
        );
    }

    getFileForWeek(idStudent: number, cycleId: number, weekId: number, fileType: 'pdf' | 'csv'): Observable<string> {
        return this.http.get<string>(
            `${this.baseUrl + this.rootPath}/${idStudent}/cycle/${cycleId}/week/${weekId}/export/${fileType}`,
            { responseType: 'text' as 'json' } // Indica que esperas una respuesta en texto (Base64)
        );
    }

    getTemplates(): Observable<Template[]> {
        return this.http.get<Template[]>(`${this.baseUrl}/exercise/templates`);
    }

}
