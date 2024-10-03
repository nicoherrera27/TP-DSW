import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimalService } from '../../../services/animal/animal.service.js';
import { Animal } from '../../../models/animal/animal.model.js';

@Component({
  selector: 'app-animal-details',
  standalone: true,
  imports: [],
  templateUrl: './animal-details.component.html',
  styleUrl: './animal-details.component.css'
})
export class AnimalDetailsComponent  {
  selesctedAnimal: Animal | undefined;
  constructor(
    private route: ActivatedRoute, 
    public animalService: AnimalService
  ) { }

  ngOnInit(): void {
    const animalid = this.route.snapshot.paramMap.get('id')
  }

  getAnimal(id: number) {
    this.animalService.getAnimal(id).subscribe({
      next: (data) => {
        this.selesctedAnimal = data
      },
      error: (error) => 
        {console.log(error)}
    
    
    })
  }
}