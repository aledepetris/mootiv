import { Component } from '@angular/core';
import { MaterialModule } from '../../../modules/material.module';
import { RouterModule } from '@angular/router';
import { NgFor, NgStyle } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgFor, NgStyle,
    MaterialModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {

  public sidebarItems = [
    { label: 'Home', icon: 'home', url: './home' },
    { label: 'Configuración', icon: 'settings', url: './configuration' },
    { label: 'Ejercicios', icon: 'fitness_center', url: './exercise' },
    { label: 'Alumnos', icon: 'group', url: './alumns' },
  ]

}
