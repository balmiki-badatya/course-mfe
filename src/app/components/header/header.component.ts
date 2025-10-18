import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['../../../styles/header.styles.css']
})
export class HeaderComponent {
  onSignOut(): void {
    console.log('Sign out clicked - functionality to be implemented');
  }
}
