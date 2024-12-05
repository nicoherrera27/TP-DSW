import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimalService } from '../../services/animal/animal.service.js';
import { Animal } from '../../models/animal/animal.model.js';
import { Person } from '../../models/person/person.model.js';
import { PersonService } from '../../services/person/person.service.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdoptionService } from '../../services/adoption/adoption.service.js';
import { Adoption } from '../../models/adoption/adoption.model.js';

@Component({
  selector: 'app-adopt-animal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './adopt-animal.component.html',
  styleUrl: './adopt-animal.component.css'
})
export class AdoptAnimalComponent {
  selectedAnimal: Animal | any;
  people: Person[] | any;
  docType: string = '';
  docNro: string = '';
  foundPerson: Person | null = null;
  comments: string = '';

  constructor(private route: ActivatedRoute, public animalService: AnimalService, public personService: PersonService, private adoptionService: AdoptionService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.getAnimal(id);
    this.getPeople();
  }

  getAnimal(id: number) {
    this.animalService.getAnimal(id).subscribe({
      next:(response) => {
        this.selectedAnimal = response.data;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  getPeople(){
    this.personService.getPeople().subscribe({
      next:(response) => {
        this.people = response.data;
      },
      error:(error) => {
        console.log(error);
      }
    })
  }

  searchPerson(){
    this.personService.searchPerson(this.docType, this.docNro).subscribe({
      next:(response) => {
        this.foundPerson = response.data;
      },
      error:(error) => {
        console.log(error);
        this.foundPerson = null;
      }
    })
  }

  confirmAdoption() {
    if (this.selectedAnimal && this.foundPerson) {
      const newAdoption = new Adoption(
        this.selectedAnimal.id,
        this.foundPerson.id!,
        new Date(),
        this.comments
      );

      this.adoptionService.postAdoption(newAdoption).subscribe({
        next: (response) => {
          alert('Adopción confirmada con éxito');
        },
        error: (error) => {
          console.error('Error al confirmar la adopción:', error);
          alert('Hubo un problema al registrar la adopción.');
        },
      });
    }
  }
}
