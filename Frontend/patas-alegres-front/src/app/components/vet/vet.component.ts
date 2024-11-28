import { Component } from '@angular/core';
import { VetService } from '../../services/vet/vet.service.js';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vet',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './vet.component.html',
  styleUrl: './vet.component.css'
})
export class VetComponent {
    constructor(public vetService: VetService, private router: Router) {}

  ngOnInit(): void {
    this.getVets();
  }

  getVets(){
    this.vetService.getVets().subscribe({
      next: (response) => {
        this.vetService.vets = response.data;
        console.log(response)
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  deleteVet(id: number){
    this.vetService.deleteVet(id).subscribe({
      next: (response) => {
       console.log(response);
       this.getVets();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  
  navigateToVetCreate(){
    this.router.navigate(['/vet/create']);
  }

}
