import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

  model: any[] = [];

  constructor(public layoutService: LayoutService) { }

  ngOnInit() {
    this.model = [
      {
        label: 'Home',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
        ]
      },
      {
        label: 'Admin',
        items: [
          { label: 'Entrenadores', icon: 'pi pi-fw pi-home', routerLink: ['/trainers'] },
        ]
      },
      {
        label: 'Backoffice',
        items: [
          { label: 'Affecciones', icon: 'pi pi-fw pi-home', routerLink: ['/affections'] },
          { label: 'Ejercicios', icon: 'pi pi-fw pi-home', routerLink: ['/exercises'] },
          { label: 'Tipos Ejercicios', icon: 'pi pi-fw pi-home', routerLink: ['/exercisetypes'] },
          { label: 'Objetivos', icon: 'pi pi-fw pi-home', routerLink: ['/goals'] },
          { label: 'Equipamiento', icon: 'pi pi-fw pi-home', routerLink: ['/equipments'] },
        ]
      },
      {
        label: 'Alumnos',
        items: [
          { label: 'Alumnos', icon: 'pi pi-fw pi-users', routerLink: ['/students'] },
        ]
      }
    ];
  }
}
