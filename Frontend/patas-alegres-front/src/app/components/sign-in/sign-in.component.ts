import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule,FormBuilder } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user/user.service.js';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../services/errors/error.service.js';


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
  loding: boolean = false;


  constructor(private route: ActivatedRoute,public userService: UserService, public errorservice: ErrorService ) {
    this.username = new FormControl('',[Validators.required, Validators.minLength(3)]);
    this.password = new FormControl('',[Validators.required, Validators.minLength(6)]);
    


    
    this.UserForm = new FormGroup({
      username: this.username,
      password: this.password,

    });
  }

  SignIn() {
    if (this.UserForm.valid) {
      const user: any = {
        username: this.UserForm.value.username,
        password: this.UserForm.value.password,

      };
      this.userService.signIn(user).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          alert('Usuario creado exitosamente!');
          this['router'].navigate(['/login']); 
        },
     error: (e: HttpErrorResponse) => {
          this.errorservice.msjError(e);
      }
    });
    } else {
      console.log('Formulario inválido');

  }
  }
}


