import { Breed } from '../breed/breed.model';
import { Rescue } from '../rescue/rescue.model.js';

export class Animal {
  id?: number;
  name: string;
  birth_date: Date;
  breed: Breed;
  rescueClass: Rescue;
  data: Animal | undefined;

  constructor(name: string, rescue_date: Date, birth_date: Date, breed: Breed, rescue: Rescue) {
    this.name = name;
    this.birth_date = birth_date;
    this.breed = breed;
    this.rescueClass = rescue
  }
}
