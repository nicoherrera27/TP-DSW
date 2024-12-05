import { Component } from '@angular/core';
import { AnimalService } from '../../services/animal/animal.service.js';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../shared/header/header/header.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnimalFormComponent } from './animal-form/animal-form.component.js';
import { RouterLink } from '@angular/router';
import { AnimalFilterPipe } from '../../pipes/animal-filter.pipe.js';
@Component({
  selector: 'app-animal',
  standalone: true,
  imports: [CommonModule,  ReactiveFormsModule,  RouterLink, AnimalFilterPipe, FormsModule],
  templateUrl: './animal.component.html',
  styleUrl: './animal.component.css'
})
export class AnimalComponent {
  breeds: string  = ''; 
  rescue: string  = ''; 
  index: any;

  constructor(public animalService: AnimalService) { 

  }
  ngOnInit(): void {
    this.getAnimals();
  }
  
  getAnimals() {
    this.animalService.getAnimals().subscribe({
    next: (response) => {
      const animals = response.data;
      animals.forEach((animal: any) => {
        // Obtener el nombre de la especie (breed)
        this.animalService.getBreed(animal.breed).subscribe((breed) => {
          animal.breed = breed.data; // Reemplaza el ID con el objeto completo
        });

        // Obtener la fecha de rescate
        this.animalService.getRescue(animal.rescueClass).subscribe((rescue) => {
          animal.rescueClass = rescue.data; // Reemplaza el ID con el objeto completo
        });
      });
      this.animalService.animals = animals; // Asigna la lista actualizada
      console.log(this.animalService.animals);
      
    },
    error: (error) => {
      console.log(error)
    }
  })
  }
  deleteAnimal(id: number){
    this.animalService.deleteAnimal(id).subscribe({
      next: (response) => {
       console.log(response);
       this.getAnimals();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
