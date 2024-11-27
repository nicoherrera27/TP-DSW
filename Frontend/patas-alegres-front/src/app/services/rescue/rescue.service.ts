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
}
