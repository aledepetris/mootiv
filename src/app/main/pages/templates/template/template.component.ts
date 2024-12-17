import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExercisesService } from 'src/app/main/services/exercise.service';
import { Template } from 'src/app/main/interfaces/template.interface';
import Swal from 'sweetalert2';
import { ExerciseDetail, ExerciseRoutine } from 'src/app/main/interfaces/cycle.detail.interface';

@Component({
    selector: 'app-template',
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.scss'],
})
export class TemplateComponent implements OnInit {
    // Modo de edición
    isEditMode = false;

    // Formulario del template
    templateForm: Template = {
        name: '',
        description: '',
        exercises: [],
    };

    // Modal de ejercicios
    displayExerciseModal: boolean = false;
    newExercise: ExerciseRoutine | null = null;
    isExerciseEditMode: boolean = false;

    // Lista de ejercicios disponibles para el combo
    availableExercises: ExerciseDetail[] = [];

    constructor(
        private exercisesService: ExercisesService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        // Verificar si es edición
        this.activatedRoute.params.subscribe((params) => {
            const templateId = params['id'];
            if (templateId) {
                this.isEditMode = true;
                this.loadTemplate(templateId);
            }
        });

        // Cargar los ejercicios disponibles
        this.loadAvailableExercises();
    }

    // Cargar datos del template para edición
    loadTemplate(templateId: number): void {
        this.exercisesService.getExerciseTemplateById(templateId).subscribe({
            next: (template: Template) => {
                this.templateForm = {
                    ...template,
                    exercises: [...template.exercises],
                };
            },
            error: () => {
                Swal.fire('Error', 'No se pudo cargar el template.', 'error');
            },
        });
    }


    // Cargar ejercicios disponibles para el combo
    loadAvailableExercises(): void {
        this.exercisesService.getExercises().subscribe({
            next: (exercises: ExerciseDetail[]) => {
                this.availableExercises = exercises.sort((a, b) => a.name.localeCompare(b.name));
            },
            error: () => {
                Swal.fire('Error', 'No se pudieron cargar los ejercicios disponibles.', 'error');
            },
        });
    }

    // Agregar nuevo ejercicio
    addExercise(): void {
        this.isExerciseEditMode = false;
        this.newExercise = {
            id: null,
            exercise: null,
            sets: 1,
            repetitions: 10,
            weight: 0,
            rest: 60,
            notes: '',
        };
        this.displayExerciseModal = true;
    }

    // Editar ejercicio existente
    editExercise(exercise: ExerciseRoutine): void {
        this.isExerciseEditMode = true;

        // Buscar el ejercicio correspondiente en la lista disponible
        const selectedExercise = this.availableExercises.find(
            ex => ex.id === exercise.exercise.id
        );

        // Asignar el ejercicio encontrado al objeto editable
        this.newExercise = {
            ...exercise,
            exercise: selectedExercise || null
        };

        this.displayExerciseModal = true;
    }


    // Confirmar agregar/editar ejercicio
    confirmAddExercise(): void {
        if (!this.newExercise || !this.newExercise.exercise) {
            Swal.fire('Error', 'Debe seleccionar un ejercicio válido.', 'error');
            return;
        }

        if (this.isExerciseEditMode) {
            const index = this.templateForm.exercises!.findIndex(e => e.exercise.id === this.newExercise?.exercise.id);
            if (index !== -1) {
                this.templateForm.exercises![index] = { ...this.newExercise! };
            }
        } else {
            this.templateForm.exercises!.push({ ...this.newExercise! });
        }

        this.displayExerciseModal = false;
        this.newExercise = null; // Reset modal state
    }

    // Eliminar ejercicio
    deleteExercise(exercise: ExerciseRoutine): void {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Este ejercicio será eliminado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.templateForm.exercises = this.templateForm.exercises!.filter(e => e !== exercise);
                Swal.fire('Eliminado', 'El ejercicio ha sido eliminado.', 'success');
            }
        });
    }

    // Guardar template (crear o editar)
    onSubmit(): void {
        if (!this.templateForm.name) {
            Swal.fire('Error', 'El nombre del template es obligatorio.', 'error');
            return;
        }

        const request = this.isEditMode
            ? this.exercisesService.updateExerciseTemplate(this.templateForm.id!, this.templateForm)
            : this.exercisesService.postExerciseTemplate(this.templateForm);

        request.subscribe({
            next: () => {
                Swal.fire('¡Éxito!', `El template se ha ${this.isEditMode ? 'actualizado' : 'creado'} correctamente.`, 'success')
                    .then(() => this.router.navigate(['/templates']));
            },
            error: () => {
                Swal.fire('Error', 'No se pudo guardar el template.', 'error');
            },
        });
    }

    // Cerrar modal
    closeModal(): void {
        this.displayExerciseModal = false;
        this.newExercise = null;
    }

    viewNotes(exercise: ExerciseRoutine): void {
        const notes = exercise?.notes || 'Sin notas disponibles.';
        Swal.fire({
            title: 'Notas del Ejercicio',
            text: notes,
            icon: 'info',
            confirmButtonText: 'Cerrar'
        });
    }
}
