import { Component, OnInit } from '@angular/core';
import { TrainersService } from '../../../services/trainers.service';
import { StudentsService } from 'src/app/main/services/students.service';
import { TrainerRequest } from 'src/app/main/interfaces/trainer.request.interface';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-trainer',
    templateUrl: './trainer.component.html',
    styleUrls: ['./trainer.component.scss']
})
export class TrainerComponent implements OnInit {
    studentOptions: { label: string; value: number }[] = [];
    selectedStudents: number[] = [];
    trainerId: number;
    isEditMode = false;

    defaultPhoto = 'assets/no-image.png'; // Imagen por defecto
    photoUrl: string = ''; // URL temporal de la foto
    trainerForm: TrainerRequest = {
        dni: null,
        name: '',
        lastName: '',
        email: '',
        telephone: '',
        birthdate: null,
        idsStudents: [],
        alt_img: ''
    };

    constructor(
        private trainersService: TrainersService,
        private studentsService: StudentsService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.loadStudents();
        this.checkIfEditMode();
    }

    // Cargar lista de estudiantes disponibles
    loadStudents(): void {
        this.studentsService.getStudents().subscribe({
            next: (students) => {
                this.studentOptions = students.map(student => ({
                    label: `${student.name} ${student.lastName}`,
                    value: +student.id!
                }));
            },
            error: () => {
                Swal.fire('Error', 'No se pudieron cargar los estudiantes.', 'error');
            }
        });
    }

    // Verifica si es edición
    checkIfEditMode(): void {
        this.activatedRoute.params.subscribe((params) => {
            this.trainerId = params['id'];
            if (this.trainerId) {
                this.isEditMode = true;
                this.loadTrainer(this.trainerId.toString());
            }
        });
    }

    // Cargar entrenador en modo edición
    loadTrainer(trainerId: string): void {
        this.trainersService.getTrainerById(trainerId).subscribe({
            next: (trainer) => {
                this.trainerForm = {
                    dni: trainer.dni ? Number(trainer.dni) : null,
                    name: trainer.name,
                    lastName: trainer.lastName,
                    email: trainer.email,
                    telephone: trainer.telephone,
                    birthdate: trainer.birthdate ? new Date(trainer.birthdate) : null,
                    active: trainer.active,
                    idsStudents: trainer.students.map(s => +s.id),
                    alt_img: trainer.alt_img || this.defaultPhoto
                };
                this.selectedStudents = [...this.trainerForm.idsStudents];
                this.photoUrl = this.trainerForm.alt_img!;
            },
            error: () => {
                Swal.fire('Error', 'No se pudo cargar el entrenador.', 'error');
            }
        });
    }

    // Actualizar URL de la foto
    updatePhotoUrl(url: string): void {
        this.photoUrl = url;
    }

    // Si la imagen falla, mostrar imagen por defecto
    onImageError(): void {
        this.photoUrl = this.defaultPhoto;
    }

    // Enviar formulario
    onSubmit(): void {
        this.trainerForm.alt_img = this.photoUrl;
        this.trainerForm.idsStudents = this.selectedStudents;

        if (this.isEditMode) {
            // PUT para actualizar
            this.trainersService.updateTrainer(this.trainerId.toString(), this.trainerForm).subscribe({
                next: () => {
                    Swal.fire('¡Éxito!', 'El entrenador ha sido actualizado correctamente.', 'success')
                        .then(() => this.router.navigate(['/trainers']));
                },
                error: () => {
                    Swal.fire('Error', 'No se pudo actualizar el entrenador.', 'error');
                }
            });
        } else {
            // POST para crear
            this.trainersService.postTrainer(this.trainerForm).subscribe({
                next: () => {
                    Swal.fire('¡Éxito!', 'El entrenador ha sido creado correctamente.', 'success')
                        .then(() => this.router.navigate(['/trainers']));
                },
                error: () => {
                    Swal.fire('Error', 'No se pudo crear el entrenador.', 'error');
                }
            });
        }
    }
}
