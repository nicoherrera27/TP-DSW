import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PersonService } from '../../../services/person/person.service.js';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './person-form.component.html',
  styleUrl: './person-form.component.css'
})
export class PersonFormComponent {
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

  constructor(private route: ActivatedRoute, public personService: PersonService){
    this.name = new FormControl('', [Validators.required]);
    this.surname = new FormControl('', [Validators.required]);
    this.doc_type = new FormControl('', [Validators.required]);
    this.doc_nro = new FormControl('', [Validators.required]);
    this.email = new FormControl('');
    this.phone = new FormControl('');
    this.birthdate = new FormControl('', [Validators.required]);
    this.address = new FormControl('', [Validators.required]);
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
      nroCuit: this.nroCuit,
    })
  }

  ngOnInit() {
  }

  postPerson(){
    const personData = { ...this.personForm.value };
    if (personData.nroCuit === ''){
      personData.nroCuit = null;
    }

    this.personService.postPerson(this.personForm.value).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
