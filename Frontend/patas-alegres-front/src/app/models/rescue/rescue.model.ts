import {Animal} from "../animal/animal.model";
import { Shelter } from "../shelter/shelter.model.js";


export class Rescue {
  id?: number;
  rescue_date: Date;
  description: string;
  coments: string;
  shelters: Shelter[];
  animals: Animal[];


  constructor(rescue_date: Date, description: string, coments: string, updatedAt: Date, createdAt: Date, shelters: Shelter[] = [], animals: Animal[] = []) {
    this.rescue_date = rescue_date;
    this.description = description;
    this.coments = coments;
    this.shelters = shelters;
    this.animals = animals;
  }
}
