import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Condition } from '../interfaces/condition.interface';

@Injectable({ providedIn: 'root' })
export class StudentConditionService {

    private baseUrl: string = environment.baseUrl;
    private rootPath: string = '/student'
    private basePath: string = '/condition'

    constructor(private http: HttpClient) { }

    // Obtener todas las medidas de un estudiante
    getConditions(idStudent: number): Observable<Condition[]> {
        return this.http.get<Condition[]>(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}`
        );
    }

    // Obtener una medida específica por ID de estudiante e ID de medida
    getConditionById(idStudent: number, idCondition: number): Observable<Condition> {
        return this.http.get<Condition>(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}/${idCondition}`
        );
    }

    // Crear una nueva medida para un estudiante
    postCondition(idStudent: number, condition: Condition): Observable<Condition> {
        return this.http.post<Condition>(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}`,
            condition
        );
    }

    // Actualizar una medida existente para un estudiante
    updateCondition(idStudent: number, idCondition: number, condition: Condition): Observable<any> {
        return this.http.put(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}/${idCondition}`,
            condition
        );
    }

    // Eliminar una medida específica para un estudiante
    deleteCondition(idStudent: number, idCondition: number): Observable<any> {
        return this.http.delete(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}/${idCondition}`
        );
    }
}
