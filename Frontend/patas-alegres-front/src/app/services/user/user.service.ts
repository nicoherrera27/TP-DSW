import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user/user.model.js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly API_URL = 'http://localhost:3000/api/user';
  readonly API_URL2 = 'http://localhost:3000/api/user/login';
  users: User[] = [];


  constructor(private http: HttpClient) { 
    this.users = [];

  }

  /*signIn(user: User): Observable<{message: string, data: User}> {
    return this.http.post<{message: string, data: User}>(this.API_URL, user);*/
  
    signIn(user: User){
    return this.http.post<{message: string, data: User}>(this.API_URL , user);  }

    addUser(user: User) {
    this.users.push(user);}

   login(user: User):Observable<string> {
    return this.http.post<string>(this.API_URL2, user)
   }
  /*getAnimals(): Observable<any> {
    // Suponiendo que ya tienes un token almacenado en el almacenamiento local o en algún lugar
    const token = localStorage.getItem('authToken');  // O donde estés almacenando el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get('http://localhost:3000/api/animal', { headers });
  }*/



}
