import { Shelter } from "../shelter/shelter/shelter.model.js";

export class Zone {
  id?: number;
  name: string;
  updatedAt: Date;
  createdAt: Date;
  shelters: Shelter[];

  constructor(name: string, updatedAt: Date, createdAt: Date, shelters: Shelter[] = []){
    this.name = name;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
    this.shelters = shelters;
  }
}
