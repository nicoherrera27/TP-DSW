import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AnimalService } from '../../services/animal/animal.service.js';
import { ShelterService } from '../../services/shelter/shelter.service.js';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(public animalService: AnimalService, public shelterService: ShelterService, private router: Router){}

  ngOnInit(): void {
    this.getAnimals();
    this.getShelters();
  }

  getAnimals(){
    this.animalService.getAnimals().subscribe({
      next:(response) => {
        this.animalService.animals = response.data;
      },
      error:(error) => {
        console.log(error)
      }
    })
  }

  getShelters(){
    this.shelterService.getShelters().subscribe({
      next:(response) => {
        this.shelterService.shelters = response.data;
      },
      error:(error) => {
        console.log(error);
      }
    })
  }

  title: string = 'Patas alegres front end';
}
