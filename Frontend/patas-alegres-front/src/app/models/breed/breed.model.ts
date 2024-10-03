import { Animal } from "../animal/animal.model.js";
export class Breed {
  id?: number;
  name: string;
  description: string;
  animals: Animal[];

  constructor(name: string, description: string, animals: Animal[] = []) {
    this.name = name;
    this.description = description;
    this.animals = animals;
  }
}
