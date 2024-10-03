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
}