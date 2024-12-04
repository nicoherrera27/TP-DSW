import { Component } from '@angular/core';
import { BreedService } from '../../services/breed/breed.service.js';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breed',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './breed.component.html',
  styleUrl: './breed.component.css'
})
export class BreedComponent {
    constructor(public breedService: BreedService, private router: Router) {}


  ngOnInit(): void {
    this.getBreeds();
  }

  getBreeds(){
    this.breedService.getBreeds().subscribe({
      next: (response) => {
        console.log(response.data);
        this.breedService.breeds = response.data;
        console.log(response.data);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  deleteBreed(id: number){
    this.breedService.deleteBreed(id).subscribe({
      next: (response) => {
       console.log(response);
       this.getBreeds();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  
  navigateToBreedCreate(){
    this.router.navigate(['breed/create']);
  }

}
