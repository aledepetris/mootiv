import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Goal } from 'src/app/main/interfaces/goal.interface';
import { GoalsService } from 'src/app/main/services/goal.service';
import { TrainingTypesService } from 'src/app/main/services/training-type.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-goal-list',
    templateUrl: './goal-list.component.html',
    styleUrls: ['./goal-list.component.scss']
})
export class GoalListComponent implements OnInit {

    goals: Goal[] = [];
    trainingTypesMap: Map<number, string> = new Map(); // Mapeo ID -> Nombre

    sortOptions: SelectItem[] = [];
    sortOrder: number = 0;
    sortField: string = '';

    constructor(private goalService: GoalsService, private trainingTypesService: TrainingTypesService) { }

    ngOnInit(): void {
        this.loadTrainingTypes(); // Cargar tipos de entrenamiento
        this.loadGoals(); // Cargar objetivos
        this.sortOptions = [
            { label: 'Nombre Ascendente', value: 'name' },
            { label: 'Nombre Descendente', value: '!name' }
        ];
    }

    loadGoals(): void {
        this.goalService.getGoals().subscribe({
            next: (goals: Goal[]) => {
                this.goals = goals.sort((a, b) => a.name.localeCompare(b.name));
            },
            error: (error) => {
                console.error('Error al cargar los objetivos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al cargar los objetivos. Intente nuevamente.',
                    confirmButtonText: 'Aceptar',
                });
            }
        });
    }

    loadTrainingTypes(): void {
        this.trainingTypesService.getTrainingTypes().subscribe({
            next: (trainingTypes) => {
                trainingTypes.forEach(type => {
                    this.trainingTypesMap.set(type.id!, type.name);
                });
            },
            error: (error) => {
                console.error('Error al cargar los tipos de entrenamiento:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al cargar los tipos de entrenamiento. Intente nuevamente.',
                    confirmButtonText: 'Aceptar',
                });
            }
        });
    }

    getTrainingTypeName(id: number): string {
        return this.trainingTypesMap.get(id) || 'Desconocido';
    }

    onSortChange(event: any): void {
        const value = event.value;

        if (value.startsWith('!')) {
            this.sortOrder = -1;
            this.sortField = value.substring(1);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    onFilter(dv: DataView, event: Event): void {
        dv.filter((event.target as HTMLInputElement).value);
    }

    confirmDelete(goalId: number): void {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el objetivo de manera permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                this.goalService.deleteGoal(goalId).subscribe({
                    next: () => {
                        Swal.fire('¡Eliminado!', 'El objetivo ha sido eliminado correctamente.', 'success');
                        this.goals = this.goals.filter(goal => goal.id !== goalId);
                    },
                    error: (error) => {
                        const errorMessage =
                            error?.error?.error?.[0]?.errorMessage ||
                            'Hubo un problema al eliminar el objetivo. Intente nuevamente.';
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: errorMessage,
                            confirmButtonText: 'Aceptar',
                        });
                    },
                });
            }
        });
    }

    onImageError(event: Event): void {
        const imgElement = event.target as HTMLImageElement;
        imgElement.src = 'assets/no-image.png'; // Ruta de la imagen predeterminada
    }
}
