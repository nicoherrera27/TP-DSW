import { Component } from '@angular/core';
import { ZoneService } from '../../services/zone/zone.service.js';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-zone',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './zone.component.html',
  styleUrl: './zone.component.css'
})
export class ZoneComponent {
  constructor(public zoneService: ZoneService, private router: Router) {}


  ngOnInit(): void {
    this.getZones();
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

  deleteZone(id: number){
    this.zoneService.deleteZone(id).subscribe({
      next: (response) => {
       console.log(response);
       this.getZones();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  
  navigateToZoneCreate(){
    this.router.navigate(['/zone/create']);
  }

}
