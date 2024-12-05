import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VetService } from '../../../services/vet/vet.service.js';

@Component({
  selector: 'app-vet-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './vet-form.component.html',
  styleUrl: './vet-form.component.css'
})
export class VetFormComponent {
  vetForm: FormGroup;
  name: FormControl;
  address: FormControl;
  shelters: FormControl;


  constructor(private route: ActivatedRoute, public vetService: VetService){
    this.name = new FormControl('', [Validators.required]);
    this.address = new FormControl('');
    this.shelters = new FormControl('');

    this.vetForm = new FormGroup({
      name: this.name,
      address: this.address,
      shelters: this.shelters
    })
  }

  postVet(){
    this.vetService.postVet(this.vetForm.value).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
