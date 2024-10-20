import { Injectable } from '@angular/core';
import { Animal } from '../../models/animal/animal.model.js';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  /*updateAnimal(updatedAnimal: any) {
    throw new Error('Method not implemented.');
  }*/
  readonly API_URL= 'http://localhost:3000/api/animal'
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