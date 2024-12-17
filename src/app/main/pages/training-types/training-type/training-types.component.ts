import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TrainingType } from '../../../interfaces/training-type.interface';
import { ExerciseType } from '../../../interfaces/exercise-type.interface';
import { TrainingTypesService } from 'src/app/main/services/training-type.service';
import { ExerciseTypesService } from 'src/app/main/services/excercise-type.service';

@Component({
    selector: 'app-training-type',
    templateUrl: './training-types.component.html',
    styleUrls: ['./training-types.component.scss'],
})
export class TrainingTypeComponent implements OnInit {
    isEditMode = false;

    // Formulario
    trainingTypeForm: TrainingType = {
        name: '',
        description: '',
        idsExerciseTypes: [],
    };

    // PickList Datos
    availableExerciseTypes: ExerciseType[] = []; // Lista de ejercicios disponibles
    associatedExerciseTypes: ExerciseType[] = []; // Lista de ejercicios asociados

    constructor(
        private trainingTypesService: TrainingTypesService,
        private exerciseTypesService: ExerciseTypesService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        // Verificar si es edición
        this.activatedRoute.params.subscribe((params) => {
            const trainingTypeId = params['id']; // Leer el parámetro `id`

            // Cargar datos del tipo de entrenamiento y ejercicios disponibles
            if (trainingTypeId) {
                this.isEditMode = true;
                this.loadTrainingTypeAndExercises(trainingTypeId);
            } else {
                this.loadAvailableExerciseTypes(); // Solo cargar ejercicios si es creación
            }
        });
    }

    /**
     * Carga en paralelo los datos del `TrainingType` y los ejercicios disponibles.
     */
    loadTrainingTypeAndExercises(id: number): void {
        Promise.all([
            this.exerciseTypesService.getExerciseTypes().toPromise(),
            this.trainingTypesService.getTrainingTypeById(id).toPromise(),
        ])
            .then(([exerciseTypes, trainingType]) => {
                this.availableExerciseTypes = exerciseTypes;
                this.trainingTypeForm = trainingType;

                // Dividir los ejercicios entre asociados y disponibles
                this.associatedExerciseTypes = this.availableExerciseTypes.filter((exercise) =>
                    trainingType.idsExerciseTypes.includes(exercise.id!)
                );

                this.availableExerciseTypes = this.availableExerciseTypes.filter(
                    (exercise) => !trainingType.idsExerciseTypes.includes(exercise.id!)
                );
            })
            .catch((error) => {
                console.error('Error al cargar datos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al cargar los datos. Intente nuevamente.',
                    confirmButtonText: 'Aceptar',
                }).then(() => this.router.navigate(['/trainingtypes'])); // Redirigir si hay error
            });
    }

    /**
     * Carga únicamente los ejercicios disponibles.
     */
    loadAvailableExerciseTypes(): void {
        this.exerciseTypesService.getExerciseTypes().subscribe({
            next: (exerciseTypes: ExerciseType[]) => {
                this.availableExerciseTypes = exerciseTypes;
            },
            error: (error) => {
                console.error('Error al cargar los ejercicios disponibles:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al cargar los ejercicios disponibles.',
                    confirmButtonText: 'Aceptar',
                });
            },
        });
    }

    /**
     * Enviar formulario.
     */
    onSubmit(): void {
        if (!this.trainingTypeForm.name || !this.trainingTypeForm.description) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor complete todos los campos antes de guardar.',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        // Crear el payload con los IDs de los ejercicios asociados
        const payload: TrainingType = {
            ...this.trainingTypeForm,
            idsExerciseTypes: this.associatedExerciseTypes.map((exercise) => exercise.id!), // IDs de los ejercicios
        };

        if (this.isEditMode) {
            // Actualizar (PUT)
            this.trainingTypesService.updateTrainingType(this.trainingTypeForm.id!, payload).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'El tipo de entrenamiento se actualizó correctamente.',
                        confirmButtonText: 'Aceptar',
                    }).then(() => this.router.navigate(['/trainingtypes']));
                },
                error: (error) => {
                    console.error('Error al actualizar el tipo de entrenamiento:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un problema al actualizar los datos. Intente nuevamente.',
                        confirmButtonText: 'Aceptar',
                    });
                },
            });
        } else {
            // Crear (POST)
            this.trainingTypesService.postTrainingType(payload).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'El tipo de entrenamiento se creó correctamente.',
                        confirmButtonText: 'Aceptar',
                    }).then(() => this.router.navigate(['/trainingtypes']));
                },
                error: (error) => {
                    console.error('Error al crear el tipo de entrenamiento:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un problema al guardar los datos. Intente nuevamente.',
                        confirmButtonText: 'Aceptar',
                    });
                },
            });
        }
    }
}
