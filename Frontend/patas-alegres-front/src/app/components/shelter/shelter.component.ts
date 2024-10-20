import { Component } from '@angular/core';
import { ShelterService } from '../../services/shelter/shelter.service.js';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shelter',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shelter.component.html',
  styleUrl: './shelter.component.css'
})
export class ShelterComponent {
  constructor(public shelterService: ShelterService) {}

  ngOnInit(): void{
    this.getShelters();
  }

  getShelters(){
    this.shelterService.getShelters().subscribe({
    next: (response) =>{
      this.shelterService.shelters = response.data;
    },
    error: (error) => {
      console.log(error);
    }
    })
  }

  deleteShelter(id: number){
    this.shelterService.deleteShelter(id).subscribe({
    next: (response) =>{
      console.log(response);
      this.getShelters();
    },
    error: (error) => {
      console.log(error);
    }
  })
  }
}


