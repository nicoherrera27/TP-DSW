import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PersonService } from '../../services/person/person.service.js';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './person.component.html',
  styleUrl: './person.component.css'
})
export class PersonComponent {
  constructor( private router: Router, public personService: PersonService) {}

  ngOnInit(): void{
    this.getPeople();
  }

  getPeople(){
    this.personService.getPeople().subscribe({
    next: (response) =>{
      this.personService.people = response.data;
    },
    error: (error) => {
      console.log(error);
    }
    })
  }

  deletePerson(id: number){
    this.personService.deletePerson(id).subscribe({
    next: (response) =>{
      console.log(response);
      this.getPeople();
    },
    error: (error) => {
      console.log(error);
    }
    })
  }

  navigateToPersonCreate(){
    this.router.navigate(['/person/create']);
  }
}

