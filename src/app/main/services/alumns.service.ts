import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alumn } from '../interfaces/alumn.interface';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class AlumnsService {

  private baseUrl: string = environment.baseUrl;
  private basePath: string = '/alumns'

  constructor( private http: HttpClient) {}

  getAlumns(): Observable<Alumn[]> {
    return this.http.get<Alumn[]>(
      `${ this.baseUrl + this.basePath }`
    )
  }

  getAlumnById(id: string): Observable<Alumn|undefined> {
    return this.http.get<Alumn>(
      `${ this.baseUrl + this.basePath }/${ id }`
    )
  }
}
