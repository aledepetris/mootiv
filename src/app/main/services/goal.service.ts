import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Goal } from '../interfaces/goal.interface';


@Injectable({ providedIn: 'root' })
export class GoalsService {

    private baseUrl: string = environment.baseUrl;
    private basePath: string = '/goal'

    constructor(private http: HttpClient) { }

    getGoals(): Observable<Goal[]> {
        return this.http.get<Goal[]>(
            `${this.baseUrl + this.basePath}`
        )
    }

    getGoalById(id: number): Observable<Goal | undefined> {
        return this.http.get<Goal>(
            `${this.baseUrl + this.basePath}/${id}`
        )
    }

    postGoal(goal: Goal): Observable<Goal> {
        return this.http.post<Goal>(`${this.baseUrl + this.basePath}`, goal);
    }

    updateGoal(id: number, goal: Goal): Observable<any> {
        return this.http.put(`${this.baseUrl + this.basePath}/${id}`, goal);
    }

    deleteGoal(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl + this.basePath}/${id}`);
    }

}
