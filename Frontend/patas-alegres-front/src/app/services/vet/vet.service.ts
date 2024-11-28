import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vet } from '../../models/vet/vet.model.js';


@Injectable({
  providedIn: 'root'
})
export class VetService {

  readonly API_URL = 'http://localhost:3000/api/vet'

  vets: Vet[] = [];

  constructor(private http: HttpClient) {
    this.vets = [];
  }

  getVets(){
    return this.http.get<{message: string, data: Vet[]}>(this.API_URL,);
  }

  getVet(id: number){
    return this.http.get<{data: Vet}>(`${this.API_URL}/${id}`);
  }

  postVet(vet: Vet){
    return this.http.post<{message: string, data: Vet}>(this.API_URL, vet);
  }

  updateVet(vet: Vet){
    return this.http.put<{message: string, data: Vet}>(`${this.API_URL}/${vet.id}`, vet);
  }

  deleteVet(id: number){
    return this.http.delete<{message: string, data: Vet}>(`${this.API_URL}/${id}`);
  }
}
