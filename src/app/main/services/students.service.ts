import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../interfaces/student.interface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StudentsService {

    private baseUrl: string = environment.baseUrl;
    private basePath: string = '/student'

    constructor(private http: HttpClient) { }

    getStudents(): Observable<Student[]> {
        return this.http.get<Student[]>(
            `${this.baseUrl + this.basePath}`
        )
    }

    getStudentById(id: string): Observable<Student | undefined> {
        return this.http.get<Student>(
            `${this.baseUrl + this.basePath}/${id}`
        )
    }

    postStudent(trainer: Student): Observable<Student> {
        return this.http.post<Student>(`${this.baseUrl + this.basePath}`, trainer);
    }

    updateStudent(id: string, trainer: Student): Observable<any> {
        return this.http.put(`${this.baseUrl + this.basePath}/${id}`, trainer);
    }

    deleteStudent(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl + this.basePath}/${id}`);
    }
}
