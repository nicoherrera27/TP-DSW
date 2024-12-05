import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Adoption } from '../../models/adoption/adoption.model.js';

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {
  readonly API_URL = 'http://localhost:3000/api/adoption'

  adoptions: Adoption[] = [];

  constructor(private http: HttpClient) { 
    this.adoptions = [];
  }

  getAdoptions(){
    return this.http.get<{message: string, data: Adoption[]}>(this.API_URL);
  }

  getAdoption(id: number){
    return this.http.get<{data: Adoption}>(`${this.API_URL}/${id}`);
  }

  postAdoption(Adoption: Adoption){
    return this.http.post<{message: string, data: Adoption}>(this.API_URL, Adoption);
  }

  updateAdoption(Adoption: Adoption){
    return this.http.put<{message: string, data: Adoption}>(`${this.API_URL}/${Adoption.id}`, Adoption);
  }

  deleteAdoption(id: number){
    return this.http.delete<{message: string, data: Adoption}>(`${this.API_URL}/${id}`);
  }}
