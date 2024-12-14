import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Measure } from '../interfaces/measure.interface';

@Injectable({ providedIn: 'root' })
export class StudentMeasureService {

    private baseUrl: string = environment.baseUrl;
    private rootPath: string = '/student'
    private basePath: string = '/measure'

    constructor(private http: HttpClient) { }

    // Obtener todas las medidas de un estudiante
    getMeasures(idStudent: number): Observable<Measure[]> {
        return this.http.get<Measure[]>(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}`
        );
    }

    // Obtener una medida específica por ID de estudiante e ID de medida
    getMeasureById(idStudent: number, idMeasure: number): Observable<Measure> {
        return this.http.get<Measure>(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}/${idMeasure}`
        );
    }

    // Crear una nueva medida para un estudiante
    postMeasure(idStudent: number, measure: Measure): Observable<Measure> {
        return this.http.post<Measure>(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}`,
            measure
        );
    }

    // Actualizar una medida existente para un estudiante
    updateMeasure(idStudent: number, idMeasure: number, measure: Measure): Observable<any> {
        return this.http.put(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}/${idMeasure}`,
            measure
        );
    }

    // Eliminar una medida específica para un estudiante
    deleteMeasure(idStudent: number, idMeasure: number): Observable<any> {
        return this.http.delete(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}/${idMeasure}`
        );
    }
}
