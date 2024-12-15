import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/main/interfaces/student.interface';
import { DatePipe } from '@angular/common'; // Importa DatePipe
import { StudentsService } from 'src/app/main/services/students.service';
import Swal from 'sweetalert2';
import { Condition } from 'src/app/main/interfaces/condition.interface';
import { StudentConditionService } from 'src/app/main/services/student.condition.service';
import { AffectionsService } from 'src/app/main/services/affection.service';

export enum Severity {
    LOW = 'BAJA',
    MODERATE = 'MODERADA',
    HIGH = 'SEVERA',
}

export enum Status {
    ACTIVE = 'ACTIVA',
    INACTIVE = 'INACTIVA',
    RESOLVED = 'RESUELTA',
}

@Component({
    selector: 'app-student-condition',
    templateUrl: './student-condition.component.html',
    styleUrls: ['./student-condition.component.scss'],
    providers: [DatePipe], // Agrega DatePipe como proveedor

})
export class StudentConditionComponent implements OnInit {
    student: Student;
    conditions: Condition[] = [];
    loading: boolean = false;

    conditionDialogVisible: boolean = false;
    currentCondition: Condition = {
        diagnosisDate: null, // Neutro, se asigna en openNewCondition o editCondition
        severity: '',
        currentStatus: '',
        idAffection: null,
        notes: '',
    };

    affections: { label: string; value: number }[] = [];
    severities = [
        { label: 'Baja', value: 'BAJA' },
        { label: 'Moderada', value: 'MODERADA' },
        { label: 'Severa', value: 'SEVERA' },
    ];
    statuses = [
        { label: 'Activa', value: 'ACTIVA' },
        { label: 'Inactiva', value: 'INACTIVA' },
        { label: 'Resuelta', value: 'RESUELTA' },
    ];
    isEditMode: boolean = false;

    notesDialogVisible: boolean = false; // Controla la visibilidad del diálogo
    currentNote: string = ''; // Almacena la nota que se va a mostrar

    showNotes(note: string): void {
        this.currentNote = note; // Asigna la nota seleccionada
        this.notesDialogVisible = true; // Muestra el diálogo
    }

    closeNotesDialog(): void {
        this.notesDialogVisible = false; // Oculta el diálogo
        this.currentNote = ''; // Limpia la nota actual
    }

    constructor(
        private studentsService: StudentsService,
        private conditionService: StudentConditionService,
        private affectionService: AffectionsService,
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
                    this.loadConditions();
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

    navigateTo(page: string): void {
        let path = `/${page}/${this.student.id}`;
        this.router.navigate([path]);
    }

    loadConditions(): void {
        this.loading = true; // Mostrar el spinner
        this.conditionService.getConditions(+this.student.id).subscribe({
            next: (data) => {
                this.conditions = data;
                this.loading = false; // Ocultar el spinner
            },
            error: (err) => {
                console.error('Error al cargar las condiciones:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar las condiciones. Intente nuevamente más tarde.',
                    confirmButtonText: 'Aceptar',
                });
                this.loading = false; // Ocultar el spinner incluso en caso de error
            },
        });
    }

    confirmDelete(conditionId: number): void {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas eliminar esta condición? Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteCondition(conditionId);
            }
        });
    }

    deleteCondition(conditionId: number): void {
        this.conditionService.deleteCondition(+this.student.id, conditionId).subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Condición eliminada!',
                    text: 'La condición fue eliminada correctamente.',
                    confirmButtonText: 'Aceptar',
                });
                this.conditions = this.conditions.filter(condition => condition.idAffection !== conditionId);
            },
            error: (err) => {
                console.error('Error al eliminar la condición:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar la condición. Intente nuevamente.',
                    confirmButtonText: 'Aceptar',
                });
            },
        });
    }

    createCondition(): void {
        this.router.navigate(['/students', this.student.id, 'conditions', 'new']);
    }

    openNewCondition(): void {
        this.currentCondition = {
            diagnosisDate: new Date(), // Fecha actual
            severity: '',
            currentStatus: '',
            idAffection: null,
            notes: '',
        };
        this.isEditMode = false;
        this.conditionDialogVisible = true;
        this.loadAffections();
    }

    editCondition(conditionId: number): void {
        const conditionToEdit = this.conditions.find(condition => condition.id === conditionId);
        if (conditionToEdit) {
            this.currentCondition = {
                ...conditionToEdit,
                diagnosisDate: new Date(conditionToEdit.diagnosisDate) // Conversión necesaria
            };
            this.isEditMode = true;
            this.conditionDialogVisible = true;
            this.loadAffections();
        }
    }

    hideConditionDialog(): void {
        this.conditionDialogVisible = false;
        this.currentCondition = {
            diagnosisDate: new Date(),
            severity: '',
            currentStatus: '',
            idAffection: null,
            notes: '',
        };
    }

    saveCondition(): void {
        if (!this.currentCondition.diagnosisDate) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor seleccione una fecha de diagnóstico válida.',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        if (this.isEditMode) {
            this.conditionService.updateCondition(+this.student.id, this.currentCondition.id!, this.currentCondition)
                .subscribe({
                    next: () => {
                        Swal.fire('¡Éxito!', 'La condición fue actualizada correctamente.', 'success');
                        this.loadConditions(); // Recargar la lista
                        this.hideConditionDialog();
                    },
                    error: () => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un problema al actualizar la condición.',
                        });
                    },
                });
        } else {
            this.conditionService.postCondition(+this.student.id, this.currentCondition).subscribe({
                next: (newCondition) => {
                    Swal.fire('¡Éxito!', 'La condición fue creada correctamente.', 'success');
                    this.conditions.push(newCondition); // Agregar a la lista
                    this.hideConditionDialog();
                },
                error: () => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un problema al crear la condición.',
                    });
                },
            });
        }
    }


    loadAffections(callback?: () => void): void {
        this.affectionService.getAffections().subscribe({
            next: (affections) => {
                this.affections = affections.map(affection => ({
                    label: affection.name,
                    value: affection.id,
                }));
                if (callback) {
                    callback(); // Ejecuta el callback después de cargar las afecciones
                }
            },
            error: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al cargar las afecciones.',
                });
            },
        });
    }

}
