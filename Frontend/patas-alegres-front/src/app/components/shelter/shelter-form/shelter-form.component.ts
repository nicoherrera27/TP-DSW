import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShelterService } from '../../../services/shelter/shelter.service.js';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ZoneService } from '../../../services/zone/zone.service.js';
import { VetService } from '../../../services/vet/vet.service.js';

@Component({
  selector: 'app-shelter-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './shelter-form.component.html',
  styleUrl: './shelter-form.component.css'
})
export class ShelterFormComponent {
  shelterForm: FormGroup;
  name: FormControl;
  address: FormControl;
  max_capacity: FormControl;
  zone: FormControl;
  rescue: FormControl;
  vet: FormControl;
  zones: any[] = [];
  vets: any[] = [];

  constructor(private route: ActivatedRoute, public shelterService: ShelterService, private zoneService: ZoneService, private vetService: VetService){
    this.name = new FormControl('', [Validators.required]);
    this.address = new FormControl('', [Validators.required]);
    this.max_capacity = new FormControl('', [Validators.required]);
    this.zone = new FormControl('', [Validators.required]);
    this.rescue = new FormControl('');
    this.vet = new FormControl('', [Validators.required]);

    this.shelterForm = new FormGroup({
      name: this.name,
      address: this.address,
      max_capacity: this.max_capacity,
      zone: this.zone,
      rescue: this.rescue,
      vet: this.vet,
    })
  }

  ngOnInit() {
    this.loadZones();
    this.loadVets();
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

  loadVets(){
    this.vetService.getVets().subscribe({
      next: (data) => {
        this.vets = data.data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  postShelter(){
    this.shelterService.postShelter(this.shelterForm.value).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}



