import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Place } from '../interfaces/place.interface';

@Injectable({ providedIn: 'root' })
export class StudentPlaceService {

    private baseUrl: string = environment.baseUrl;
    private rootPath: string = '/student'
    private basePath: string = '/training-place'

    constructor(private http: HttpClient) { }

    // Obtener todas las medidas de un estudiante
    getPlaces(idStudent: number): Observable<Place[]> {
        return this.http.get<Place[]>(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}`
        );
    }

    // Obtener una medida específica por ID de estudiante e ID de medida
    getPlaceById(idStudent: number, idPlace: number): Observable<Place> {
        return this.http.get<Place>(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}/${idPlace}`
        );
    }

    // Crear una nueva medida para un estudiante
    postPlace(idStudent: number, place: Place): Observable<Place> {
        return this.http.post<Place>(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}`,
            place
        );
    }

    // Actualizar una medida existente para un estudiante
    updatePlace(idStudent: number, idPlace: number, place: Place): Observable<any> {
        return this.http.put(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}/${idPlace}`,
            place
        );
    }

    // Eliminar una medida específica para un estudiante
    deletePlace(idStudent: number, idPlace: number): Observable<any> {
        return this.http.delete(
            `${this.baseUrl + this.rootPath}/${idStudent}${this.basePath}/${idPlace}`
        );
    }
}
