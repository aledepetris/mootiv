import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Equipment } from '../interfaces/equipment.interface';


@Injectable({providedIn: 'root'})
export class EquipmentsService {

  private baseUrl: string = environment.baseUrl;
  private basePath: string = '/equipment'

  constructor( private http: HttpClient) {}

  getEquipments(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(
      `${ this.baseUrl + this.basePath }`
    )
  }

  getEquipmentById(id: string): Observable<Equipment|undefined> {
    return this.http.get<Equipment>(
      `${ this.baseUrl + this.basePath }/${ id }`
    )
  }

  postEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(`${this.baseUrl + this.basePath}`, equipment);
  }

  updateEquipment(id: string, equipment: Equipment): Observable<any> {
    return this.http.put(`${this.baseUrl + this.basePath}/${id}`, equipment);
  }

  deleteEquipment(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl + this.basePath}/${id}`);
  }


}
