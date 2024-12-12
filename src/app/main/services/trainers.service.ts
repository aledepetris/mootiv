import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Trainer } from '../interfaces/trainer.interface';

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
}
