import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'header-student',
    templateUrl: './header-student.component.html',
    styleUrls: ['./header-student.component.scss'],
})
export class StudentHeaderComponent {
    @Input() student: any; // Cambia `any` por `Student` si tienes una interfaz definida.

    // Menú estático
    menuItems = [
        { title: 'Dashboard Alumno', route: 'students/view', icon: 'pi pi-home' },
        { title: 'Plan de Entrenamiento', route: 'students/plan', icon: 'pi pi-calendar' },
        { title: 'Revisar Historia Clínica', route: 'students/condition', icon: 'pi pi-book' },
        { title: 'Medidas Antropométricas', route: 'students/measure', icon: 'pi pi-chart-bar' },
        { title: 'Lugar de Entrenamiento', route: 'students/location', icon: 'pi pi-map' },
    ];

    // Emisor de eventos para la navegación
    @Output() navigate = new EventEmitter<string>();

    navigateTo(page: string): void {
        this.navigate.emit(page); // Emitir el evento con el destino de la navegación
    }
}
