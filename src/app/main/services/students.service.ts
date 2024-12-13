import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../interfaces/student.interface';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class StudentsService {

  private baseUrl: string = environment.baseUrl;
  private basePath: string = '/student'

  constructor( private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(
      `${ this.baseUrl + this.basePath }`
    )
  }

  getStudentById(id: string): Observable<Student|undefined> {
    return this.http.get<Student>(
      `${ this.baseUrl + this.basePath }/${ id }`
    )
  }
}
