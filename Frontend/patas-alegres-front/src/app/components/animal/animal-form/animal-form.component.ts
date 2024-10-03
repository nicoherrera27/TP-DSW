import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AnimalService } from '../../../services/animal/animal.service.js';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-animal-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './animal-form.component.html',
  styleUrl: './animal-form.component.css'
})
export class AnimalFormComponent {
  animalForm: FormGroup;
  name: FormControl;
  birth_date: FormControl;
  breed: FormControl;
  rescueClass: FormControl;

  constructor(private route: ActivatedRoute,public animalService: AnimalService) {
    this.name = new FormControl('', Validators.required);
    this.birth_date = new FormControl('');
    this.breed = new FormControl('');
    this.rescueClass = new FormControl('');
    
    this.animalForm = new FormGroup({
      name: this.name,
      birth_date: this.birth_date,
      breed: this.breed,
      rescueClass: this.rescueClass
    });
   }

  handleSubmit() {
    console.log('animal create',this.animalForm.value);
    this.animalService.addAnimal(this.animalForm.value);
    this.animalForm.reset();
  }


  postAnimal(){
    this.animalService.postAnimal(this.animalForm.value).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
