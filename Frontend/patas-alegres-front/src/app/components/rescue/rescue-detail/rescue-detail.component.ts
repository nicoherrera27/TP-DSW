import { Component } from '@angular/core';
import { Rescue } from '../../../models/rescue/rescue.model.js';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RescueService } from '../../../services/rescue/rescue.service.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rescue-detail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './rescue-detail.component.html',
  styleUrl: './rescue-detail.component.css'
})
export class RescueDetailComponent {
  selectedRescue: Rescue | any;
  rescueForm: FormGroup;
  rescue_date: FormControl;
  description: FormControl;
  comments: FormControl;
  animals: FormControl;
  shelters: FormControl;

  constructor(private route: ActivatedRoute, public rescueService: RescueService){
    this.rescue_date = new FormControl('', [Validators.required]);
    this.description = new FormControl('');
    this.comments = new FormControl('');
    this.animals = new FormControl('');
    this.shelters = new FormControl('');

    this.rescueForm = new FormGroup({
      rescue_date: this.rescue_date,
      description: this.description,
      comments: this.comments,
      animals: this.animals,
      shelters: this.shelters
    })
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.getRescue(id);
  }

  getRescue(id: number) {
    this.rescueService.getRescue(id).subscribe({
      next: (response) => {
        this.selectedRescue = response.data;
        this.rescueForm.patchValue({
          rescue_date: this.rescue_date,
          description: this.description,
          comments: this.comments,
          animals: this.animals,
          shelters: this.shelters
        });
      },
      error: (error) => {
        console.log(error);
      }
    })    
  }

  updateRescue(){
    const updatedRescue = {
      ...this.rescueForm.value,
      id: this.selectedRescue.id
    }
    this.rescueService.updateRescue(updatedRescue).subscribe({
      next: (response) => {
        console.log('Rescate actualizada:', response);
      },

      error: (error) => {
        console.log('Error actualizando Rescate:', error);
      }
    })
  }

}
