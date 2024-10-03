import { Injectable } from '@angular/core';
import { Zone } from '../../models/zone/zone.model.js';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  readonly API_URL = 'http://localhost:3000/api/zone'

  zones: Zone[] = [];

  constructor(private http: HttpClient) {
    this.zones = [];
  }

  getZones(){
    return this.http.get<{message: string, data: Zone[]}>(this.API_URL);
  }

  getZone(id: number){
    return this.http.get<{data: Zone}>(`${this.API_URL}/${id}`);
  }

  postZone(zone: Zone){
    return this.http.post<{message: string, data: Zone}>(this.API_URL, zone);
  }
}
