import { Component, OnInit } from '@angular/core';
import { AnimalService } from '../../../services/animal/animal.service.js';
import { Animal } from '../../../models/animal/animal.model.js';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animal-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './animal-list.component.html',
  styleUrl: './animal-list.component.css'
})
export class AnimalListComponent implements OnInit {
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
}
