import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZoneService } from '../../../../services/zone/zone.service.js';
import { Zone } from '../../../../models/zone/zone.model.js';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-zone-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './zone-detail.component.html',
  styleUrl: './zone-detail.component.css'
})
export class ZoneDetailComponent {
  selectedZone: Zone | any;
  zoneForm: FormGroup;
  name: FormControl;

  constructor(private route: ActivatedRoute, public zoneService: ZoneService){
    this.name = new FormControl('', [Validators.required]);

    this.zoneForm = new FormGroup({
      name: this.name
    })
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.getZone(id);
  }

  getZone(id: number) {
    this.zoneService.getZone(id).subscribe({
      next: (response) => {
        this.selectedZone = response.data;
        this.zoneForm.patchValue({
          name: this.selectedZone.name
        });
      },
      error: (error) => {
        console.log(error);
      }
    })    
  }

  updateZone(){
    const updatedZone = {
      ...this.zoneForm.value,
      id: this.selectedZone.id
    }
    this.zoneService.updateZone(updatedZone).subscribe({
      next: (response) => {
        console.log('Zona actualizada:', response);
      },

      error: (error) => {
        console.log('Error actualizando zona:', error);
      }
    })
  }
}
