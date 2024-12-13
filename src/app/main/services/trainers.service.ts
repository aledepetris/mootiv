import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Trainer } from '../interfaces/trainer.interface';
import { TrainerRequest } from '../interfaces/TrainerRequest.interface';

@Injectable({providedIn: 'root'})
export class TrainersService {

  private baseUrl: string = environment.baseUrl;
  private basePath: string = '/trainer'

  constructor( private http: HttpClient) {}

  getTrainers(): Observable<Trainer[]> {
    return this.http.get<Trainer[]>(
      `${ this.baseUrl + this.basePath }`
    )
  }

  getTrainerById(id: string): Observable<Trainer|undefined> {
    return this.http.get<Trainer>(
      `${ this.baseUrl + this.basePath }/${ id }`
    )
  }

  postTrainer(trainer: TrainerRequest): Observable<Trainer> {
    return this.http.post<Trainer>(`${this.baseUrl + this.basePath}`, trainer);
  }

  updateTrainer(id: string, trainer: TrainerRequest): Observable<any> {
    return this.http.put(`${this.baseUrl + this.basePath}/${id}`, trainer);
  }

  deleteTrainer(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl + this.basePath}/${id}`);
  }


}
