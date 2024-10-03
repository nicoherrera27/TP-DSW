import { Component } from '@angular/core';
import { ZoneService } from '../../services/zone/zone.service.js';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ZoneFormComponent } from "./zone-form/zone-form/zone-form.component";

@Component({
  selector: 'app-zone',
  standalone: true,
  imports: [CommonModule, RouterModule, ZoneFormComponent],
  templateUrl: './zone.component.html',
  styleUrl: './zone.component.css'
})
export class ZoneComponent {
  constructor(public zoneService: ZoneService) {}

  ngOnInit(): void {
    this.getZones()
  }

  getZones(){
    this.zoneService.getZones().subscribe({
      next: (response) => {
        this.zoneService.zones = response.data;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
