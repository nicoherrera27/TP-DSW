import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Person } from '../../../models/person/person.model.js';
import { ActivatedRoute } from '@angular/router';
import { PersonService } from '../../../services/person/person.service.js';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './person-detail.component.html',
  styleUrl: './person-detail.component.css'
})
export class PersonDetailComponent {
  selectedPerson: Person | any;
  personForm: FormGroup;
  name: FormControl;
  surname: FormControl;
  doc_type: FormControl;
  doc_nro: FormControl;
  email: FormControl;
  phone: FormControl;
  birthdate: FormControl;
  address: FormControl;
  nroCuit: FormControl;

  constructor(private route: ActivatedRoute, public personService: PersonService) {
    this.name = new FormControl('', Validators.required);
    this.surname = new FormControl('', Validators.required);
    this.doc_type = new FormControl('', Validators.required);
    this.doc_nro = new FormControl('', Validators.required);
    this.email = new FormControl('', Validators.email);
    this.phone = new FormControl('');
    this.birthdate = new FormControl('', Validators.required);
    this.address = new FormControl('', Validators.required);
    this.nroCuit = new FormControl('');

    this.personForm = new FormGroup({
      name: this.name,
      surname: this.surname,
      doc_type: this.doc_type,
      doc_nro: this.doc_nro,
      email: this.email,
      phone: this.phone,
      birthdate: this.birthdate,
      address: this.address,
      nroCuit: this.nroCuit
    })
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.getPerson(id);
  }

  getPerson(id: number){
    this.personService.getPerson(id).subscribe({
      next: (response) => {
        this.selectedPerson = response.data;
        this.personForm.patchValue({
          name: this.selectedPerson.name,
          surname: this.selectedPerson.surname,
          doc_type: this.selectedPerson.doc_type,
          doc_nro: this.selectedPerson.doc_nro,
          email: this.selectedPerson.email,
          phone: this.selectedPerson.phone,
          birthdate: this.selectedPerson.birthdate,
          address: this.selectedPerson.address,
          nroCuit: this.selectedPerson.nroCuit,
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  updatePerson(){
    const updatedPerson = {
      ...this.personForm.value,
      id: this.selectedPerson.id,
    }
    this.personService.updatePerson(updatedPerson).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
