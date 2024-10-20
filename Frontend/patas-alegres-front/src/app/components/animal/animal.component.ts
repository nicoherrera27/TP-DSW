import { Component } from '@angular/core';
import { AnimalService } from '../../services/animal/animal.service.js';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../shared/header/header/header.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnimalFormComponent } from './animal-form/animal-form.component.js';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-animal',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ReactiveFormsModule, AnimalFormComponent, RouterLink],
  templateUrl: './animal.component.html',
  styleUrl: './animal.component.css'
})
export class AnimalComponent {
index: any;

  constructor(public animalService: AnimalService) { 

  }
  ngOnInit(): void {
    this.getAnimals();
  }
  
  getAnimals() {
    this.animalService.getAnimals().subscribe({
    next: (response) => {
      this.animalService.animals = response.data
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
