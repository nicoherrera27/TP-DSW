import { Injectable } from '@angular/core';
import { Rescue } from '../../models/rescue/rescue.model.js';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RescueService {

  readonly API_URL = 'http://localhost:3000/api/rescue'

  rescues: Rescue[] = [];

  constructor(private http: HttpClient) {
    this.rescues = [];
  }

  getRescues(){
    return this.http.get<{message: string, data: Rescue[]}>(this.API_URL,);
  }
    getRescue(id: number){
    return this.http.get<{data: Rescue}>(`${this.API_URL}/${id}`);
  }

  postRescue(rescue: Rescue){
    return this.http.post<{message: string, data: Rescue}>(this.API_URL, rescue);
  }

  updateRescue(rescue: Rescue){
    return this.http.put<{message: string, data: Rescue}>(`${this.API_URL}/${rescue.id}`, rescue);
  }

  deleteRescue(id: number){
    return this.http.delete<{message: string, data: Rescue}>(`${this.API_URL}/${id}`);
  }
}
