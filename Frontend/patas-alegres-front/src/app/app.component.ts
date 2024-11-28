import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AnimalComponent } from './components/animal/animal.component.js';
import { ZoneComponent } from './components/zone/zone.component.js';
import { HeaderComponent } from "./components/shared/header/header/header.component";
import { ZoneFormComponent } from './components/zone/zone-form/zone-form/zone-form.component.js';
import { ShelterFormComponent } from './components/shelter/shelter-form/shelter-form.component.js';
import { AnimalFormComponent } from './components/animal/animal-form/animal-form.component.js';
import { ShelterComponent } from './components/shelter/shelter.component.js';
import { LoginComponent } from './components/login/login.component.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AnimalComponent, ZoneComponent, HeaderComponent, ZoneFormComponent,
    AnimalFormComponent, ShelterComponent, ShelterFormComponent, LoginComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showHeader = true;

  constructor(private router: Router) {
  this.router.events.subscribe(() => {
    // Rutas donde no quieres mostrar el header
    const hiddenHeaderRoutes = ['/login', '/signIn'];
    this.showHeader = !hiddenHeaderRoutes.includes(this.router.url);
  });
}
  title: string = 'patas-alegres-front'
  userName: string = 'Marcelo';
}
