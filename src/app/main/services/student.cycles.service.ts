import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cycle } from '../interfaces/cycle.interface';

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
}
