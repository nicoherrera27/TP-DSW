import { Injectable } from '@angular/core';
import { Animal } from '../../models/animal/animal.model.js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Breed } from '../../models/breed/breed.model.js';
import { Rescue } from '../../models/rescue/rescue.model.js';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  /*updateAnimal(updatedAnimal: any) {
    throw new Error('Method not implemented.');
  }*/
  readonly API_URL= 'http://localhost:3000/api/animal'
  private apiUrl = 'http://localhost:3000/api';
  animals: Animal[] = [];

  constructor(private http: HttpClient) {
    this.animals = [];

   }

   addAnimal(animal: Animal) {
    this.animals.push(animal);
  }

    getAnimals(){
    return this.http.get<{message: string, data: Animal[]}>(this.API_URL)
  
    }
    getBreed(id: number) {
    return this.http.get<{ mesage: string, data: Breed }>(`${this.apiUrl}/breed/${id}`);
  }

  getRescue(id: number) {
    return this.http.get<{ mesage: string, data: Rescue }>(`${this.apiUrl}/rescue/${id}`);
  }
  
    getAnimal(id: number) {
      return this.http.get<Animal>(this.API_URL + '/' + id)
    }

    postAnimal(animal: Animal) {
      return this.http.post<{message: string, data: Animal}>(this.API_URL, animal)
    }

    updateAnimal(animal: Animal){
    return this.http.put<{message: string, data: Animal}>(`${this.API_URL}/${animal.id}`, animal);
    }

    deleteAnimal(id:number){
      return this.http.delete<{message: string, data: Animal}>(`${this.API_URL}/${id}`);
    }
  }