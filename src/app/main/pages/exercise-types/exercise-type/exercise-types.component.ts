import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExerciseTypesService } from 'src/app/main/services/excercise-type.service';
import { ExerciseType } from '../../../interfaces/exercise-type.interface';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-exercise-type',
    templateUrl: './exercise-types.component.html',
    styleUrls: ['./exercise-types.component.scss'],
})
export class ExerciseTypeComponent implements OnInit {
    isEditMode = false;

    // Formulario
    exerciseTypeForm: ExerciseType = {
        name: '',
        description: '',
    };

    constructor(
        private exerciseTypesService: ExerciseTypesService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        // Verificar si es edición
        this.activatedRoute.params.subscribe((params) => {
            const exerciseTypeId = params['id']; // Leer el parámetro `id`
            if (exerciseTypeId) {
                this.isEditMode = true;
                this.loadExerciseType(exerciseTypeId); // Cargar datos si es edición
            }
        });
    }

    // Cargar datos del tipo de entrenamiento para edición
    loadExerciseType(id: number): void {
        this.exerciseTypesService.getExerciseTypeById(id).subscribe({
            next: (exerciseType: ExerciseType) => {
                this.exerciseTypeForm = exerciseType; // Cargar los datos al formulario
            },
            error: (error) => {
                console.error('Error al cargar el tipo de entrenamiento:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al cargar el tipo de entrenamiento. Intente nuevamente.',
                    confirmButtonText: 'Aceptar',
                }).then(() => this.router.navigate(['/exercisetypes'])); // Redirigir si hay error
            },
        });
    }

    // Enviar formulario
    onSubmit(): void {
        if (!this.exerciseTypeForm.name || !this.exerciseTypeForm.description) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor complete todos los campos antes de guardar.',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        if (this.isEditMode) {
            // Actualizar (PUT)
            this.exerciseTypesService.updateExerciseType(this.exerciseTypeForm.id!, this.exerciseTypeForm).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'El tipo de entrenamiento se actualizó correctamente.',
                        confirmButtonText: 'Aceptar',
                    }).then(() => this.router.navigate(['/exercisetypes']));
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
            this.exerciseTypesService.postExerciseType(this.exerciseTypeForm).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'El tipo de entrenamiento se creó correctamente.',
                        confirmButtonText: 'Aceptar',
                    }).then(() => this.router.navigate(['/exercisetypes']));
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
