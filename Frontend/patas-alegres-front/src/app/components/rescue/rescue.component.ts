import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RescueService } from '../../services/rescue/rescue.service.js';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rescue',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './rescue.component.html',
  styleUrl: './rescue.component.css'
})
export class RescueComponent {
    constructor(public rescueService: RescueService, private router: Router) {}


  ngOnInit(): void {
    this.getRescues();
  }

  getRescues(){
    this.rescueService.getRescues().subscribe({
      next: (response) => {
        this.rescueService.rescues = response.data;
        console.log(response.data)
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  deleteRescue(id: number){
    this.rescueService.deleteRescue(id).subscribe({
      next: (response) => {
       console.log(response);
       this.getRescues();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  
  navigateToRescueCreate(){
    this.router.navigate(['rescue/create']);
  }

}
