import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Shelter } from '../../../models/shelter/shelter/shelter.model.js';
import { ShelterService } from '../../../services/shelter/shelter.service.js';


@Component({
  selector: 'app-shelter-detail',
  standalone: true,
  imports: [],
  templateUrl: './shelter-detail.component.html',
  styleUrl: './shelter-detail.component.css'
})
export class ShelterDetailComponent {
  selectedShelter: Shelter | any;
  shelterForm: FormGroup;
  name: FormControl;

  constructor(private route: ActivatedRoute, public shelterService: ShelterService){
    this.name = new FormControl('', [Validators.required]);

    this.shelterForm = new FormGroup({
      name: this.name
    })
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.getShelter(id);
  }

  getShelter(id: number) {
    this.shelterService.getShelter(id).subscribe({
      next: (response) => {
        this.selectedShelter = response.data;
        this.shelterForm.patchValue({
          name: this.selectedShelter.name
        });
      },
      error: (error) => {
        console.log(error);
      }
    })    
  }

  updateShelter(){
    const updatedShelter = {
      ...this.shelterForm.value,
      id: this.selectedShelter.id
    }
    this.shelterService.updateShelter(updatedShelter).subscribe({
      next: (response) => {
        console.log('Zona actualizada:', response);
      },

      error: (error) => {
        console.log('Error actualizando zona:', error);
      }
    })
  }
}



