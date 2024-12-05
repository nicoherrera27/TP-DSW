import { Shelter } from "../shelter/shelter.model.js";

export class Vet{
  id: number;
  name: string;
  adress: string;
  shelters: Shelter[];

  constructor(id: number, name: string, adress: string, shelters: Shelter[] = []) {
    this.id = id;
    this.name = name;
    this.adress = adress;
    this.shelters = shelters;
  }
}
