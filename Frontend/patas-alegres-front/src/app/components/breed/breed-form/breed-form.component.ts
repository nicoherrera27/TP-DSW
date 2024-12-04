import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BreedService } from '../../../services/breed/breed.service.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breed-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './breed-form.component.html',
  styleUrl: './breed-form.component.css'
})
export class BreedFormComponent {
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


  postBreed(){
    this.breedService.postBreed(this.breedForm.value).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
