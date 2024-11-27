import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Breed } from '../../models/breed/breed.model.js';

@Injectable({
  providedIn: 'root'
})
export class BreedService {
  readonly API_URL = 'http://localhost:3000/api/breed'

  breeds: Breed[] = [];

  constructor(private http: HttpClient) {
    this.breeds = [];
  }

  getBreeds(){
    return this.http.get<{message: string, data: Breed[]}>(this.API_URL,);
  }

}
