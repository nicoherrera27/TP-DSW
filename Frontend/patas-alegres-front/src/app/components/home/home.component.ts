import { Component, OnInit } from '@angular/core';
import { AnimalService } from '../../services/animal/animal.service.js';
import { ShelterService } from '../../services/shelter/shelter.service.js';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  animals: any[] = [];
  shelters: any[] = [];
  filteredAnimals: any[] = [];
  uniqueBreeds: string[] = [];
  uniqueZones: string[] = [];
  selectedBreed: string = '';
  selectedZone: string = '';
  sortOrder: string = 'asc';

  constructor(
    private animalService: AnimalService,
    public shelterService: ShelterService
  ) {}

  ngOnInit(): void {
    this.getAnimals();
    this.getShelters();
  }

  getAnimals(): void {
    this.animalService.getAnimals().subscribe({
      next: (response) => {
        this.animals = response.data;
        this.filteredAnimals = [...this.animals];
        this.extractUniqueBreeds();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getShelters(): void {
    this.shelterService.getShelters().subscribe({
      next: (response) => {
        this.shelterService.shelters = response.data;
        this.extractUniqueZones();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  extractUniqueBreeds(): void {
    this.uniqueBreeds = [
      ...new Set(this.animals.map((animal) => animal.breed.name)) // Extraer el nombre de la raza
    ].sort();
  }

  extractUniqueZones(): void {
    this.uniqueZones = [
      ...new Set(this.shelterService.shelters.map((shelter) => shelter.zone.name)),
    ].sort();
  }

  filterAnimals(): void {
    this.filteredAnimals = this.animals.filter((animal) => {
      return (
        (this.selectedBreed === '' || animal.breed.name === this.selectedBreed) && // Comparar con el nombre
        (this.selectedZone === '' ||
          this.shelters.some(
            (shelter) =>
              shelter.zone.name === this.selectedZone &&
              shelter.id === animal.shelterId
          ))
      );
    });
    this.sortAnimals();
  }

  sortAnimals(): void {
    this.filteredAnimals.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return this.sortOrder === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }
}
