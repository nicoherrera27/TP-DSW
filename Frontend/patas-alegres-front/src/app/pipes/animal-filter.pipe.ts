import { Pipe, PipeTransform } from '@angular/core';
import { Animal } from '../models/animal/animal.model.js';

@Pipe({
  name: 'animalFilter',
  standalone: true
})
export class AnimalFilterPipe implements PipeTransform {
  transform(animals: Animal[],  breed: string | null, rescue: string | null ): Animal[] {
    if (!animals) return [];
    if (!breed && !rescue) return animals;

    return animals.filter((animal) => {
      const matchesBreeds = breed
        ? animal.breed?.name.toLowerCase().includes(breed.toLowerCase())
        : true;
      const matchesRescue = rescue
        ? animal.rescueClass?.rescue_date.toLocaleDateString().toLowerCase().includes(rescue.toLowerCase())
        : true;
      return matchesBreeds && matchesRescue;
    });
  }

 /* transform( animals: Animal[],
    species: string | null,
    rescue: string | null): Animal[] {
    if (!animals) return [];
    if (!species && !rescue) return animals;

    return animals.filter((animal) => {
      const matchesSpecies = species
        ? animal.breed?.name.toLowerCase().includes(species.toLowerCase())
        : true;
      const matchesRescue = rescue
        ? animal.rescueClass?.rescue_date.toLocaleDateString().toLowerCase().includes(rescue.toLowerCase())
        : true;
      return matchesSpecies && matchesRescue;
    });
  }*/

}
