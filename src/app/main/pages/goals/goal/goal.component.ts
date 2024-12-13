import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Goal, ScheduleGoal } from 'src/app/main/interfaces/goal.interface';
import { GoalsService } from 'src/app/main/services/goal.service';
import Swal from 'sweetalert2';
import { TrainingTypesService } from 'src/app/main/services/training-type.service';

@Component({
    selector: 'app-training-type',
    templateUrl: './goal.component.html',
    styleUrls: ['./goal.component.scss'],
})
export class GoalComponent implements OnInit {
    isEditMode = false;

    // Formulario principal
    goalForm: Goal = {
        name: '',
        description: '',
        scheduleGoals: [],
    };

    // Array dinámico para metas del objetivo
    scheduleGoals: ScheduleGoal[] = [];

    // Opciones de tipos de entrenamiento
    trainingTypesOptions: { label: string; value: number }[] = [];

    constructor(
        private goalsService: GoalsService,
        private trainingTypeService: TrainingTypesService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        // Cargar tipos de entrenamiento
        this.loadTrainingTypes();

        // Verificar si es edición
        this.activatedRoute.params.subscribe((params) => {
            const goalId = params['id']; // Leer el parámetro `id`
            if (goalId) {
                this.isEditMode = true;
                this.loadGoal(goalId); // Cargar datos si es edición
            } else {
                // Añadir una fila inicial si es creación
                this.addScheduleGoal();
            }
        });
    }

    loadTrainingTypes(): void {
        this.trainingTypeService.getTrainingTypes().subscribe({
            next: (trainingTypes) => {
                this.trainingTypesOptions = trainingTypes.map((type) => ({
                    label: type.name,
                    value: type.id,
                }));
            },
            error: (error) => {
                console.error('Error al cargar tipos de entrenamiento:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al cargar los tipos de entrenamiento. Intente nuevamente.',
                    confirmButtonText: 'Aceptar',
                });
            },
        });
    }

    loadGoal(id: number): void {
        this.goalsService.getGoalById(id).subscribe({
            next: (goal: Goal) => {
                this.goalForm = goal;
                console.log(goal);

                // Sincronizar scheduleGoal desde el backend al array scheduleGoals
                if (goal.scheduleGoals && goal.scheduleGoals.length > 0) {
                    this.scheduleGoals = goal.scheduleGoals.map((schedule) => ({
                        day: schedule.day,
                        idsTrainingTypes: [...schedule.idsTrainingTypes], // Copiar los IDs correctamente
                    }));
                } else {
                    this.scheduleGoals = [];
                }
            },
            error: (error) => {
                console.error('Error al cargar el objetivo:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al cargar el objetivo. Intente nuevamente.',
                    confirmButtonText: 'Aceptar',
                }).then(() => this.router.navigate(['/goals'])); // Redirigir si hay error
            },
        });
    }


    addScheduleGoal(): void {
        this.scheduleGoals.push({ day: '', idsTrainingTypes: [] });
    }

    removeScheduleGoal(index: number): void {
        this.scheduleGoals.splice(index, 1);
    }

    onSubmit(): void {
        // Validar si hay campos vacíos en el formulario
        const hasEmptyFields = this.scheduleGoals.some(goal =>
            !goal.day || goal.idsTrainingTypes.length === 0
        );

        if (hasEmptyFields) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor complete todos los días y seleccione al menos un tipo de entrenamiento para cada día.',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        // Validar si hay días duplicados
        const days = this.scheduleGoals.map(goal => goal.day);
        const hasDuplicateDays = new Set(days).size !== days.length;

        if (hasDuplicateDays) {
            Swal.fire({
                icon: 'warning',
                title: 'Días duplicados',
                text: 'No puede haber días repetidos en las metas.',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        // Preparar el payload para el request
        const payload: Goal = {
            ...this.goalForm,
            scheduleGoals: this.scheduleGoals,
        };

        if (this.isEditMode) {
            this.goalsService.updateGoal(payload.id!, payload).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Actualizado!',
                        text: 'El objetivo fue actualizado con éxito.',
                        confirmButtonText: 'Aceptar',
                    }).then(() => this.router.navigate(['/goals']));
                },
                error: (error) => {
                    console.error('Error al actualizar el objetivo:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un problema al actualizar el objetivo. Intente nuevamente.',
                        confirmButtonText: 'Aceptar',
                    });
                },
            });
        } else {
            this.goalsService.postGoal(payload).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Creado!',
                        text: 'El objetivo fue creado con éxito.',
                        confirmButtonText: 'Aceptar',
                    }).then(() => this.router.navigate(['/goals']));
                },
                error: (error) => {
                    console.error('Error al crear el objetivo:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un problema al crear el objetivo. Intente nuevamente.',
                        confirmButtonText: 'Aceptar',
                    });
                },
            });
        }
    }

}
