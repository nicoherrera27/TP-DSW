import { Injectable } from '@angular/core';
import { Shelter } from '../../models/shelter/shelter.model.js';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShelterService {
  readonly API_URL = 'http://localhost:3000/api/shelter'

  shelters: Shelter[] = [];

  constructor(private http: HttpClient) { 
    this.shelters = [];
  }

  getShelters(){
    return this.http.get<{message: string, data: Shelter[]}>(this.API_URL);
  }

  getShelter(id: number){
    return this.http.get<{data: Shelter}>(`${this.API_URL}/${id}`);
  }

  postShelter(Shelter: Shelter){
    return this.http.post<{message: string, data: Shelter}>(this.API_URL, Shelter);
  }

  updateShelter(Shelter: Shelter){
    return this.http.put<{message: string, data: Shelter}>(`${this.API_URL}/${Shelter.id}`, Shelter);
  }

  deleteShelter(id: number){
    return this.http.delete<{message: string, data: Shelter}>(`${this.API_URL}/${id}`);
  }
}
