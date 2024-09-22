import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnimalComponent } from './components/animal/animal.component.js';
import { ZoneComponent } from './components/zone/zone.component.js';
import { HeaderComponent } from "./components/shared/header/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AnimalComponent, ZoneComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title: string = 'patas-alegres-front'
  userName: string = 'Marcelo';
}
