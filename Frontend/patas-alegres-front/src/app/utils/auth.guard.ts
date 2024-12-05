import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (_route, state) => {
  const router: Router = inject(Router);
  const token = localStorage.getItem('token') 
  if(token == undefined){
    alert('Debe iniciar sesión para continuar');
    router.navigate(['/login']);}
return true;
}



