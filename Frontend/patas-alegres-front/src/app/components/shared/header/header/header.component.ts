import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMenuOpen = false;

 constructor(private router: Router) { }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

    logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }
}