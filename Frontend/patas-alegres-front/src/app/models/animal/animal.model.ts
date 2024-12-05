import { Breed } from '../breed/breed.model';
import { Rescue } from '../rescue/rescue.model.js';

export class Animal {
  id?: number;
  name: string;
  birth_date: Date;
  breed: Breed;
  rescueClass: Rescue;
  data: Animal | undefined;
  updatedAt: Date;
  createdAt: Date;
  images?: String[];

  constructor(name: string, rescue_date: Date, birth_date: Date, breed: Breed, rescue: Rescue, updatedAt: Date, createdAt: Date, images?: String[]) {
    this.name = name;
    this.birth_date = birth_date;
    this.breed = breed;
    this.rescueClass = rescue;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
    this.images = images;
  }
}
