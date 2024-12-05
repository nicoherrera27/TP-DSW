import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RescueService } from '../../../services/rescue/rescue.service.js';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rescue-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './rescue-form.component.html',
  styleUrl: './rescue-form.component.css'
})
export class RescueFormComponent {
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

  postRescue(){
    this.rescueService.postRescue(this.rescueForm.value).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

}
