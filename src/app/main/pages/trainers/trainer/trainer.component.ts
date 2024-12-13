import { Component, OnInit } from '@angular/core';
import { TrainersService } from '../../../services/trainers.service';
import { StudentsService } from 'src/app/main/services/students.service';
import { TrainerRequest } from 'src/app/main/interfaces/trainer.request.interface';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'app-trainer',
    templateUrl: './trainer.component.html',
    styleUrl: './trainer.component.scss'
})
export class TrainerComponent implements OnInit {

    studentOptions: { label: string; value: string }[] = [];
    selectedStudents: number[] = [];
    isEditMode = false; // Indica si el formulario está en modo edición
    trainerForm: TrainerRequest = {
        dni: null,
        name: '',
        lastName: '',
        email: '',
        telephone: '',
        birthdate: null,
        active: false,
        idsStudents: [],
    };

    constructor(
        private trainersService: TrainersService,
        private studentsService: StudentsService,
        private router: Router,
        private activatedRoute: ActivatedRoute

    ) { }

    ngOnInit(): void {
        this.loadStudents();

        // Verifica si es edición
        this.activatedRoute.params.subscribe((params) => {
            const trainerId = params['id'];
            if (trainerId) {
                this.isEditMode = true; // Activa el modo edición
                this.loadTrainer(trainerId);
            }
        });

    }

    loadStudents(): void {
        this.studentsService.getStudents().subscribe({
            next: (students) => {
                this.studentOptions = students.map(student => ({
                    label: `${student.name} ${student.lastName}`,
                    value: student.id || ''
                }));
            },
            error: (error) => {
                console.error('Error al cargar los estudiantes:', error);
            }
        });
    }

    onSubmit(): void {
        this.trainerForm.idsStudents = this.selectedStudents;
        const trainerId = this.activatedRoute.snapshot.params['id'];
        if (this.isEditMode) {
            // PUT para actualizar
            this.trainersService.updateTrainer(trainerId, this.trainerForm).subscribe({
                next: (response) => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'El entrenador se actualizó correctamente.',
                        confirmButtonText: 'Aceptar',
                    }).then(() => {
                        this.router.navigate(['/trainers']);
                    });
                },
                error: (error) => {
                    const errorMessage =
                        error?.error?.error?.[0]?.errorMessage ||
                        'Hubo un problema al actualizar los datos. Intente nuevamente.';
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: errorMessage,
                        confirmButtonText: 'Aceptar',
                    });
                },
            });
        } else {
            // POST para crear
            this.trainersService.postTrainer(this.trainerForm).subscribe({
                next: (response) => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'El entrenador se creó correctamente.',
                        confirmButtonText: 'Aceptar',
                    }).then(() => {
                        this.router.navigate(['/trainers']);
                    });
                },
                error: (error) => {
                    const errorMessage =
                        error?.error?.error?.[0]?.errorMessage ||
                        'Hubo un problema al guardar los datos. Intente nuevamente.';
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: errorMessage,
                        confirmButtonText: 'Aceptar',
                    });
                },
            });
        }
    }



    loadTrainer(trainerId: string): void {
        this.trainersService.getTrainerById(trainerId).subscribe({
            next: (trainer) => {
                this.trainerForm = {
                    dni: Number(trainer.dni),
                    name: trainer.name,
                    lastName: trainer.lastName,
                    email: trainer.email,
                    telephone: trainer.telephone,
                    birthdate: trainer.birthdate ? new Date(trainer.birthdate) : null,
                    active: trainer.active,
                    idsStudents: trainer.students ? trainer.students.map((student: any) => student.id) : [] // Mapear IDs
                };
                this.selectedStudents = [...this.trainerForm.idsStudents];
            },
            error: (error) => {
                console.error('Error al cargar el entrenador:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cargar el entrenador. Intente nuevamente.',
                    confirmButtonText: 'Aceptar',
                }).then(() => {
                    this.router.navigate(['/trainers']);
                });
            },
        });
    }


}
