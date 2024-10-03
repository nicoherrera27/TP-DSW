import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZoneService } from '../../../../services/zone/zone.service.js';
import { Zone } from '../../../../models/zone/zone.model.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zone-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zone-detail.component.html',
  styleUrl: './zone-detail.component.css'
})
export class ZoneDetailComponent {
  selectedZone: Zone | any;

  constructor(private route: ActivatedRoute, public zoneService: ZoneService){}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.getZone(id);
  }

  getZone(id: number) {
    this.zoneService.getZone(id).subscribe({
      next: (response) => {
        this.selectedZone = response.data;
      },
      error: (error) => {
        console.log(error);
      }
    })    
  }
}
