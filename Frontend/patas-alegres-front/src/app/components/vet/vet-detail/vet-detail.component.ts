import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Vet } from '../../../models/vet/vet.model.js';
import { VetService } from '../../../services/vet/vet.service.js';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vet-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './vet-detail.component.html',
  styleUrl: './vet-detail.component.css'
})
export class VetDetailComponent {
  selectedVet: Vet | any;
  vetForm: FormGroup;
  name: FormControl;
  address: FormControl;

  constructor(private route: ActivatedRoute, public vetService: VetService){
    this.name = new FormControl('', [Validators.required]);
    this.address = new FormControl('');

    this.vetForm = new FormGroup({
      name: this.name,
      address: this.address
    })
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.getVet(id);
  }

  getVet(id: number) {
    this.vetService.getVet(id).subscribe({
      next: (response) => {
        this.selectedVet = response.data;
        this.vetForm.patchValue({
          name: this.selectedVet.name,
          address: this.selectedVet.address
        });
      },
      error: (error) => {
        console.log(error);
      }
    })    
  }

  updateVet(){
    const updatedVet = {
      ...this.vetForm.value,
      id: this.selectedVet.id
    }
    this.vetService.updateVet(updatedVet).subscribe({
      next: (response) => {
        console.log('Veterinario actualizado:', response);
      },

      error: (error) => {
        console.log('Error actualizando al veterinario:', error);
      }
    })
  }
}
