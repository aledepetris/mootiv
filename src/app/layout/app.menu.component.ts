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
                    { label: 'Dashboard', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/'] }
                ]
            },
            {
                label: 'Admin',
                items: [
                    { label: 'Entrenadores', icon: 'pi pi-fw pi-user-edit', routerLink: ['/trainers'] },
                ]
            },
            {
                label: 'Backoffice',
                items: [
                    { label: 'Affecciones', icon: 'pi pi-fw pi-heart', routerLink: ['/affections'] },
                    { label: 'Ejercicios', icon: 'pi pi-fw pi-play', routerLink: ['/exercises'] },
                    { label: 'Equipamiento', icon: 'pi pi-fw pi-cog', routerLink: ['/equipments'] },
                    { label: 'Musculos', icon: 'pi pi-fw pi-bolt', routerLink: ['/muscles'] },
                    { label: 'Objetivos', icon: 'pi pi-fw pi-star', routerLink: ['/goals'] },
                    { label: 'Tipos Ejercicios', icon: 'pi pi-fw pi-sliders-h', routerLink: ['/exercisetypes'] },
                    { label: 'Tipos Entrenamientos', icon: 'pi pi-fw pi-wrench', routerLink: ['/trainingtypes'] },
                ]
            },
            {
                label: 'Ejercitación',
                items: [
                    { label: 'Ejercicios', icon: 'pi pi-fw pi-users', routerLink: ['/students'] },
                    { label: 'Plantillas', icon: 'pi pi-fw pi-users', routerLink: ['/students'] },

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
