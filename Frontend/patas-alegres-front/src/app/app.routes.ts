import { Routes } from '@angular/router';
import { ZoneComponent } from './components/zone/zone.component.js';
import { AnimalComponent } from './components/animal/animal.component.js';
import { AnimalFormComponent } from './components/animal/animal-form/animal-form.component.js';
import { AnimalDetailsComponent } from './components/animal/animal-details/animal-details.component.js';
import { ZoneDetailComponent } from './components/zone/zone-detail/zone-detail/zone-detail.component.js';
import { ZoneFormComponent } from './components/zone/zone-form/zone-form/zone-form.component.js';
import { ShelterComponent } from './components/shelter/shelter.component.js';
import { ShelterDetailComponent } from './components/shelter/shelter-detail/shelter-detail.component.js';
import { ShelterFormComponent } from './components/shelter/shelter-form/shelter-form.component.js';
import { PersonComponent } from './components/person/person.component.js';
import { PersonFormComponent } from './components/person/person-form/person-form.component.js';
import { PersonDetailComponent } from './components/person/person-detail/person-detail.component.js';
import { HomeComponent } from './components/home/home.component.js';
import { AdoptAnimalComponent } from './components/adopt-animal/adopt-animal.component.js';
import { LoginComponent } from './components/login/login.component.js';
import { SignInComponent } from './components/sign-in/sign-in.component.js';
import { authGuard } from './utils/auth.guard.js';
import { BreedDetailComponent } from './components/breed/breed-detail/breed-detail.component.js';
import { BreedComponent } from './components/breed/breed.component.js';
import { BreedFormComponent } from './components/breed/breed-form/breed-form.component.js';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signIn', component: SignInComponent},
  { path: '',redirectTo: 'login',pathMatch: 'full' }, 
  {path: 'home', component: HomeComponent, canActivate:[authGuard]},


  {path: 'zone', component: ZoneComponent, canActivate:[authGuard]},
  {path: 'zone/create', component: ZoneFormComponent},
  {path: 'zone/:id', component: ZoneDetailComponent},

  {path: 'animal/create', component: AnimalFormComponent},
  {path: 'animal', component: AnimalComponent, canActivate:[authGuard]},
  {path: 'animal/:id', component:AnimalDetailsComponent},

  {path: 'shelter', component: ShelterComponent, canActivate:[authGuard]},
  {path: 'shelter/create', component: ShelterFormComponent},
  {path: 'shelter/:id', component: ShelterDetailComponent},

  {path: 'person', component: PersonComponent, canActivate:[authGuard]},
  {path: 'person/create', component: PersonFormComponent},
  {path: 'person/:id', component: PersonDetailComponent},

  {path: 'breed/:id', component: BreedDetailComponent},
  {path: 'breed', component: BreedComponent},
  {path: 'breed/create', component: BreedFormComponent},

  { path: 'adopt/:id', component: AdoptAnimalComponent, canActivate:[authGuard] },
  { path: '**',redirectTo: 'login',pathMatch: 'full' }
];
