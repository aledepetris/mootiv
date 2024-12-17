import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/main/interfaces/student.interface';
import { DataView } from 'primeng/dataview';
import { DatePipe } from '@angular/common'; // Importa DatePipe
import { StudentsService } from 'src/app/main/services/students.service';
import Swal from 'sweetalert2';
import { SelectItem } from 'primeng/api';
import { StudentPlaceService } from '../../../services/student.places.service';
import { Place } from 'src/app/main/interfaces/place.interface';

@Component({
    selector: 'app-student-condition',
    templateUrl: './student-place.component.html',
    styleUrls: ['./student-place.component.scss'],
    providers: [DatePipe], // Agrega DatePipe como proveedor

})
export class StudentPlaceComponent implements OnInit {
    student: Student;
    sortOptions: SelectItem[] = [];
    sortOrder: number = 0;
    sortField: string = '';
    places: Place[] = [];
    display: boolean = false;
    selectedPlace: any;

    constructor(
        private studentsService: StudentsService,
        private studentPlaceService: StudentPlaceService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    menuItems = [
        {
            title: 'Dashboard Alumno',
            route: 'students/view',
            icon: 'pi pi-home'
        },
        {
            title: 'Plan de Entrenamiento',
            route: 'students/plan',
            icon: 'pi pi-calendar'
        },
        {
            title: 'Revisar Historia Clínica',
            route: 'students/condition',
            icon: 'pi pi-book'
        },
        {
            title: 'Medidas Antropométricas',
            route: 'students/measure',
            icon: 'pi pi-chart-bar'
        },
        {
            title: 'Lugar de Entrenamiento',
            route: 'students/location',
            icon: 'pi pi-map'
        },
    ];

    ngOnInit(): void {
        const studentId = this.activatedRoute.snapshot.params['id'];
        if (studentId) {
            this.studentsService.getStudentById(studentId).subscribe({
                next: (data) => {
                    this.student = data;
                    this.loadPlaces();

                },
                error: (error) => {
                    console.error('Error al cargar estudiante:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo cargar el estudiante.',
                        confirmButtonText: 'Aceptar',
                    }).then(() => this.router.navigate(['/students']));
                },
            });
        }
    }

    loadPlaces(): void {
        this.studentPlaceService.getPlaces(+this.student.id).subscribe({
            next: (data) => {
                this.places = data;
            },
            error: (err) => {
                console.error('Error al cargar las condiciones:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar las condiciones. Intente nuevamente más tarde.',
                    confirmButtonText: 'Aceptar',
                });
            },
        });
    }

    onSortChange(event: any) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }

    navigateTo(page: string): void {
        let path = `/${page}/${this.student.id}`;
        console.log(path)
        this.router.navigate([path]);
    }

    showEquipments(place: Place): void {
        if (place && place.equipments && place.equipments.length > 0) {
            this.selectedPlace = place;
            this.display = true; // Mostrar el diálogo solo cuando haya datos
        } else {
            this.selectedPlace = null; // Asegurarse de que no hay datos previos
            Swal.fire('Sin equipo', 'Este lugar no tiene equipos asociados.', 'info');
        }
    }

}
