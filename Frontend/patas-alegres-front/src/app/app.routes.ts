import { Routes } from '@angular/router';
import { ZoneComponent } from './components/zone/zone.component.js';
import { ZoneDetailComponent } from './components/zone/zone-detail/zone-detail/zone-detail.component.js';
import { ZoneFormComponent } from './components/zone/zone-form/zone-form/zone-form.component.js';

export const routes: Routes = [
  {path: 'zone', component: ZoneComponent},
  {path: 'zone/:id', component: ZoneDetailComponent},
  {path: 'zone/create', component: ZoneFormComponent},
];
