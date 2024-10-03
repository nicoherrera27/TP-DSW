import { Routes } from '@angular/router';
import { ZoneComponent } from './components/zone/zone.component.js';
import { AnimalComponent } from './components/animal/animal.component.js';
import { AnimalFormComponent } from './components/animal/animal-form/animal-form.component.js';
import { AnimalDetailsComponent } from './components/animal/animal-details/animal-details.component.js';
import { AnimalListComponent } from './components/animal/animal-list/animal-list.component.js';

export const routes: Routes = [
  {path: 'zone', component: ZoneComponent},

  {path: 'animal/animalForm', component: AnimalFormComponent},
  {path: 'animal', component: AnimalListComponent},
  {path: 'animal/animalDetails/:id', component:AnimalDetailsComponent},
];
