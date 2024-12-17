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
import { EquipmentsService } from 'src/app/main/services/equipment.service';

@Component({
    selector: 'app-student-place.form',
    templateUrl: './student-place-form.component.html',
    styleUrls: ['./student-place-form.component.scss'],
    providers: [DatePipe], // Agrega DatePipe como proveedor

})
export class StudentPlaceFormComponent implements OnInit {
    student: Student;
    placeId: number;
    placeForm: Place = {
        name: '',
        idsEquipment: [],
    };
    availableEquipments: any[] = [];
    associatedEquipments: any[] = [];
    isEditMode: boolean = false;
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
    constructor(
        private studentsService: StudentsService,
        private studentPlaceService: StudentPlaceService,
        private equipmentService: EquipmentsService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        const studentId = this.activatedRoute.snapshot.params['idS'];
        this.placeId = this.activatedRoute.snapshot.params['idP'];

        if (studentId) {
            this.studentsService.getStudentById(studentId).subscribe({
                next: (data) => {
                    this.student = data;
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

        this.loadEquipments().then(() => {
            if (this.placeId) {
                this.isEditMode = true;
                this.loadPlace(this.placeId); // Cargar datos del lugar en modo edición
            }
        });
    }
    navigateTo(page: string): void {
        let path = `/${page}/${this.student.id}`;
        console.log(path)
        this.router.navigate([path]);
    }

    loadEquipments(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.equipmentService.getEquipments().subscribe({
                next: (equipments) => {
                    this.availableEquipments = equipments.map((e: any) => ({
                        id: e.id,
                        name: e.name,
                    })); // Asegurar formato consistente
                    resolve();
                },
                error: (err) => {
                    console.error('Error al cargar los equipamientos:', err);
                    this.handleBackendError(err);
                    reject(err);
                },
            });
        });
    }


    loadPlace(placeId: number): void {
        this.studentPlaceService.getPlaceById(+this.student.id, placeId).subscribe({
            next: (place) => {
                this.placeForm.name = place.name;

                // Equipos asociados
                const associatedIds = place.idsEquipment || [];

                this.associatedEquipments = this.availableEquipments.filter((equipment) =>
                    associatedIds.includes(equipment.id)
                );

                // Filtrar equipos disponibles que no estén en los asociados
                this.availableEquipments = this.availableEquipments.filter((equipment) =>
                    !associatedIds.includes(equipment.id)
                );
            },
            error: (err) => {
                console.error('Error al cargar el lugar:', err);
                this.handleBackendError(err);
            },
        });
    }


    savePlace(): void {
        // Actualizar la lista de IDs de los equipos asociados
        this.placeForm.idsEquipment = this.associatedEquipments.map((equipment) => equipment.id);

        if (this.isEditMode) {
            this.studentPlaceService.updatePlace(+this.student.id, this.placeId, this.placeForm).subscribe({
                next: () => {
                    Swal.fire('¡Éxito!', 'El lugar ha sido actualizado correctamente.', 'success');
                    this.router.navigate([`/students/location/${this.student.id}`]);
                },
                error: (err) => {
                    this.handleBackendError(err);
                },
            });
        } else {
            this.studentPlaceService.postPlace(+this.student.id, this.placeForm).subscribe({
                next: () => {
                    Swal.fire('¡Éxito!', 'El lugar ha sido creado correctamente.', 'success');
                    this.router.navigate([`/students/location/${this.student.id}`]);
                },
                error: (err) => {
                    this.handleBackendError(err);
                },
            });
        }
    }



    cancel(): void {
        this.router.navigate([`/students/location/${this.student.id}`]);
    }

    private handleBackendError(error: any): void {
        const errorMessage = error?.error?.message || 'Hubo un error al procesar la solicitud.';
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonText: 'Aceptar',
        });
    }
}

