import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule,FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user/user.service.js';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../services/errors/error.service.js';
import { PersonService } from '../../services/person/person.service.js';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
[x: string]: any;
  UserForm: FormGroup;
  username: FormControl;
  password: FormControl;
  name: FormControl;
  surname: FormControl;
  doc_type: FormControl;
  doc_nro: FormControl;
  email: FormControl;
  phone: FormControl;
  birthdate: FormControl;
  address: FormControl;
  nroCuit: FormControl;
  user: FormControl;



  constructor(private route: ActivatedRoute,public userService: UserService, public errorService: ErrorService,
     public personService: PersonService, public router: Router) {
    this.username = new FormControl('',[Validators.required, Validators.minLength(3)]);
    this.password = new FormControl('',[Validators.required, Validators.minLength(6)]);
    

    this.name = new FormControl('', [Validators.required]);
    this.surname = new FormControl('', [Validators.required]);
    this.doc_type = new FormControl('', [Validators.required]);
    this.doc_nro = new FormControl('', [Validators.required]);
    this.email = new FormControl('');
    this.phone = new FormControl('');
    this.birthdate = new FormControl('', [Validators.required]);
    this.address = new FormControl('', [Validators.required]);
    this.nroCuit = new FormControl('');
    this.user = new FormControl('');


    {
    this.UserForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      person: new FormGroup({
        name: new FormControl('', [Validators.required]),
        surname: new FormControl('', [Validators.required]),
        doc_type: new FormControl('', [Validators.required]),
        doc_nro: new FormControl('', [Validators.required]),
        email: new FormControl(''),
        phone: new FormControl(''),
        birthdate: new FormControl(''),
        address: new FormControl('', [Validators.required, Validators.minLength(11)]),
        nroCuit: new FormControl(''),
        user: new FormControl(''),

      }),
    });
  }
     }

    SignIn() {
    if (this.UserForm.valid) {
      const user: any = {
        username: this.UserForm.value.username,
        password: this.UserForm.value.password,
      };
     
    const person = {  ...this.UserForm.value.person  };

      this.userService.signIn(user).subscribe({
        next: (userResponse) => {
          console.log('Usuario creado:', userResponse); 
          person.user = userResponse.data.id;   
          console.log(userResponse.data.id);  
       
          this.personService.postPerson(person).subscribe({
            next: (personResponse) => {
              console.log('Persona creada:', personResponse);
              alert('Usuario y Persona creados exitosamente!');
              this.router.navigate(['/login']);
            },
            error: (personError: HttpErrorResponse) => {
              console.error('Error al crear persona:', personError);
              this.errorService.msjError(personError);

            },
          });
        },
        error: (userError: HttpErrorResponse) => {
          console.error('Error al crear usuario:', userError);
          this.errorService.msjError(userError);

        },
      });
    } else {
      console.log('Formulario inválido');
    }
  }
}


  
