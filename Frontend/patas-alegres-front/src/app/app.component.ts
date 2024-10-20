import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AnimalComponent } from './components/animal/animal.component.js';
import { ZoneComponent } from './components/zone/zone.component.js';
import { HeaderComponent } from "./components/shared/header/header/header.component";
import { ZoneFormComponent } from './components/zone/zone-form/zone-form/zone-form.component.js';
import { ShelterFormComponent } from './components/shelter/shelter-form/shelter-form.component.js';
import { AnimalFormComponent } from './components/animal/animal-form/animal-form.component.js';
import { ShelterComponent } from './components/shelter/shelter.component.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AnimalComponent, ZoneComponent, HeaderComponent, ZoneFormComponent,
    AnimalFormComponent, ShelterComponent, ShelterFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title: string = 'patas-alegres-front'
  userName: string = 'Marcelo';
}
