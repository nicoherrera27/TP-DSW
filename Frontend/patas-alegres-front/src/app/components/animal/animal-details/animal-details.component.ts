import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimalService } from '../../../services/animal/animal.service.js';
import { Animal } from '../../../models/animal/animal.model.js';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-animal-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './animal-details.component.html',
  styleUrl: './animal-details.component.css'
})
export class AnimalDetailsComponent  {
  selectedAnimal: Animal | any;
  animalForm: FormGroup;
  name: FormControl;
  birth_date: FormControl;
  breed: FormControl;
  rescueClass: FormControl;

  constructor(private route: ActivatedRoute, public animalService: AnimalService){
    this.name = new FormControl('', [Validators.required]);
    this.birth_date = new FormControl('');
    this.breed = new FormControl('');
    this.rescueClass = new FormControl('');

    this.animalForm = new FormGroup({
      name: this.name,
      birth_date: this.birth_date,
      breed: this.breed,
      rescueClass: this.rescueClass
    })
  }

  ngOnInit(): void {
    const animalid = this.route.snapshot.params['id']
    this.getAnimal(animalid);
  }
  
    getAnimal(id: number) {
    this.animalService.getAnimal(id).subscribe({
      next: (response) => {
        this.selectedAnimal = response.data;
        this.animalForm.patchValue({
          name: this.selectedAnimal.name,
          birth_date: this.selectedAnimal.birth_date,
          breed: this.selectedAnimal.breed.name,
          rescueClass: this.selectedAnimal.rescueClass.rescue_date
        });
        console.log('Animal cargado:', this.selectedAnimal)
      },
      error: (error) => {
        console.log(error);
      }
    })    
  }

  updateAnimal(){
    const updatedanimal = {
    ...this.animalForm.value,
    id: this.selectedAnimal.id
    }
    this.animalService.updateAnimal(updatedanimal).subscribe({
      next: (response) => {
        console.log('Animal actualizado:', response);
      },
      error: (error) => {
        console.log('Error actualizando animal:', error);
      }
    })
  }
}