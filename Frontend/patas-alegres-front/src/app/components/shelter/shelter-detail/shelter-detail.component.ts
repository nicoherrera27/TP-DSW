import { Component } from '@angular/core';
import { Shelter } from '../../../models/shelter/shelter.model.js';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ShelterService } from '../../../services/shelter/shelter.service.js';
import { CommonModule } from '@angular/common';
import { ZoneService } from '../../../services/zone/zone.service.js';

@Component({
  selector: 'app-shelter-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './shelter-detail.component.html',
  styleUrl: './shelter-detail.component.css'
})
export class ShelterDetailComponent {
  selectedShelter: Shelter | any;
  shelterForm: FormGroup;
  name: FormControl;
  address: FormControl;
  max_capacity: FormControl;
  zone: FormControl;
  zones: any[] = [];

  constructor(private route: ActivatedRoute, public shelterService: ShelterService, private zoneService: ZoneService) {
    this.name = new FormControl('', Validators.required);
    this.address = new FormControl('', Validators.required);
    this.max_capacity = new FormControl('', Validators.required);
    this.zone = new FormControl('');

    this.shelterForm = new FormGroup({
      name: this.name,
      address: this.address,
      max_capacity: this.max_capacity,
      zone: this.zone
    })
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadZones();
    this.getShelter(id);
  }

  loadZones() {
  this.zoneService.getZones().subscribe({
    next: (data) => {
      this.zones = data.data;
    },
    error: (error) => {
      console.log(error);
    }
  });
  }

  getShelter(id: number){
    this.shelterService.getShelter(id).subscribe({
      next: (response) => {
        this.selectedShelter = response.data;
        if (this.zones.length > 0) {
        this.patchZoneValue();
        } else {
          this.zoneService.getZones().subscribe({
            next: (data) => {
              this.zones = data.data;
              this.patchZoneValue();
            },
            error: (error) => {
              console.log(error);
            }
          });
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  patchZoneValue() {
    const selectedZone = this.zones.find(zone => zone.id === this.selectedShelter.zone.id);
    this.shelterForm.patchValue({
      name: this.selectedShelter.name,
      address: this.selectedShelter.address,
      max_capacity: this.selectedShelter.max_capacity,
      zone: selectedZone
    });
  }

  updateShelter(){
    const updatedShelter = {
      ...this.shelterForm.value,
      id: this.selectedShelter.id,
      zone: this.shelterForm.value.zone.id
    }
    this.shelterService.updateShelter(updatedShelter).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
