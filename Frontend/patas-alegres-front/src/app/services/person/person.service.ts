import { Injectable } from '@angular/core';
import { Person } from '../../models/person/person.model.js';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  readonly API_URL = 'http://localhost:3000/api/person'

  people: Person[] = [];

  constructor(private http: HttpClient) { 
    this.people = [];
  }

  getPeople(){
    return this.http.get<{message: string, data: Person[]}>(this.API_URL);
  }

  getPerson(id: number){
    return this.http.get<{data: Person}>(`${this.API_URL}/${id}`);
  }

  postPerson(Person: Person){
    return this.http.post<{message: string, data: Person}>(this.API_URL, Person);
  }

  updatePerson(Person: Person){
    return this.http.put<{message: string, data: Person}>(`${this.API_URL}/${Person.id}`, Person);
  }

  deletePerson(id: number){
    return this.http.delete<{message: string, data: Person}>(`${this.API_URL}/${id}`);
  }
}
