import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZoneService } from '../../../../services/zone/zone.service.js';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-zone-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './zone-form.component.html',
  styleUrl: './zone-form.component.css'
})
export class ZoneFormComponent {
  zoneForm: FormGroup;
  name: FormControl;

  constructor(private route: ActivatedRoute, public zoneService: ZoneService){
    this.name = new FormControl('', [Validators.required]);

    this.zoneForm = new FormGroup({
      name: this.name
    })
  }

  postZone(){
    this.zoneService.postZone(this.zoneForm.value).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}

