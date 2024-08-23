import { NgFor, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../modules/material.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    NgFor, NgStyle,
    MaterialModule,
    RouterModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  public sidebarItems = [
    { label: 'Home', icon: 'home', url: './home' },
    { label: 'Configuración', icon: 'settings', url: './configuration' },
    { label: 'Ejercicios', icon: 'fitness_center', url: './exercise' },
    { label: 'Alumnos', icon: 'group', url: './alumns' },
  ]

}
