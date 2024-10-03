import { Routes } from '@angular/router';
import { ZoneComponent } from './components/zone/zone.component.js';
import { AnimalComponent } from './components/animal/animal.component.js';
import { AnimalFormComponent } from './components/animal/animal-form/animal-form.component.js';
import { AnimalDetailsComponent } from './components/animal/animal-details/animal-details.component.js';
import { AnimalListComponent } from './components/animal/animal-list/animal-list.component.js';
import { ZoneDetailComponent } from './components/zone/zone-detail/zone-detail/zone-detail.component.js';
import { ZoneFormComponent } from './components/zone/zone-form/zone-form/zone-form.component.js';

export const routes: Routes = [
  {path: 'zone', component: ZoneComponent},
  {path: 'zone/:id', component: ZoneDetailComponent},
  {path: 'zone/create', component: ZoneFormComponent},

  {path: 'animal/animalForm', component: AnimalFormComponent},
  {path: 'animal', component: AnimalListComponent},
  {path: 'animal/animalDetails/:id', component:AnimalDetailsComponent},

];
