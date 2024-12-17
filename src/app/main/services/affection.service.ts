import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Affection } from '../interfaces/affection.interface';


@Injectable({ providedIn: 'root' })
export class AffectionsService {

    private baseUrl: string = environment.baseUrl;
    private basePath: string = '/affection'

    constructor(private http: HttpClient) { }

    getAffections(): Observable<Affection[]> {
        return this.http.get<Affection[]>(
            `${this.baseUrl + this.basePath}`
        )
    }

    getAffectionById(id: number): Observable<Affection | undefined> {
        return this.http.get<Affection>(
            `${this.baseUrl + this.basePath}/${id}`
        )
    }

    postAffection(affection: Affection): Observable<Affection> {
        return this.http.post<Affection>(`${this.baseUrl + this.basePath}`, affection);
    }

    updateAffection(id: number, affection: Affection): Observable<any> {
        return this.http.put(`${this.baseUrl + this.basePath}/${id}`, affection);
    }

    deleteAffection(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl + this.basePath}/${id}`);
    }

}
