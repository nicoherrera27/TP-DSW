import { Component } from '@angular/core';
import { Breed } from '../../../models/breed/breed.model.js';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BreedService } from '../../../services/breed/breed.service.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breed-detail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './breed-detail.component.html',
  styleUrl: './breed-detail.component.css'
})
export class BreedDetailComponent {
  selectedBreed: Breed | any;
  breedForm: FormGroup;
  name: FormControl;
  description: FormControl;
  animals: FormControl;

  constructor(private route: ActivatedRoute, public breedService: BreedService){
    this.name = new FormControl('', [Validators.required]);
    this.description = new FormControl('');
    this.animals = new FormControl('');

    this.breedForm = new FormGroup({
      name: this.name,
      description: this.description,
      animals: this.animals

    })
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.getBreed(id);
  }

  getBreed(id: number) {
    this.breedService.getBreed(id).subscribe({
      next: (response) => {
        this.selectedBreed = response.data;
        this.breedForm.patchValue({
          name: this.selectedBreed.name,
          description: this.selectedBreed.description,
          animals: this.selectedBreed.animals
        });
      },
      error: (error) => {
        console.log(error);
      }
    })    
  }

  updateBreed(){
    const updatedZone = {
      ...this.breedForm.value,
      id: this.selectedBreed.id
    }
    this.breedService.updateBreed(updatedZone).subscribe({
      next: (response) => {
        console.log('Zona actualizada:', response);
      },

      error: (error) => {
        console.log('Error actualizando zona:', error);
      }
    })
  }
}
