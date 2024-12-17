import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { ExerciseType } from 'src/app/main/interfaces/exercise-type.interface';
import { ExerciseTypesService } from 'src/app/main/services/excercise-type.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-exercise-type-list',
    templateUrl: './exercise-types-list.component.html',
    styleUrls: ['./exercise-types-list.component.scss']
})
export class ExerciseTypeListComponent implements OnInit {

    exerciseTypes: ExerciseType[] = [];

    sortOptions: SelectItem[] = [];

    sortOrder: number = 0;

    sortField: string = '';

    constructor(private exerciseTypeService: ExerciseTypesService) { }

    ngOnInit(): void {
        this.loadExerciseTypes();

        // Opciones de ordenamiento (puedes personalizarlas según tu modelo)
        this.sortOptions = [
            { label: 'Nombre Ascendente', value: 'name' },
            { label: 'Nombre Descendente', value: '!name' }
        ];
    }

    loadExerciseTypes(): void {
        this.exerciseTypeService.getExerciseTypes().subscribe({
            next: (exerciseTypes: ExerciseType[]) => {
                this.exerciseTypes = exerciseTypes.sort((a, b) => a.name.localeCompare(b.name));
            },
            error: (error) => {
                console.error('Error al cargar los tipos de ejercicio:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al cargar los tipos de ejercicio. Intente nuevamente.',
                    confirmButtonText: 'Aceptar',
                });
            }
        });
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

    confirmDelete(exerciseTypeId: number): void {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el tipo de ejercicio de manera permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                this.exerciseTypeService.deleteExerciseType(exerciseTypeId).subscribe({
                    next: () => {
                        Swal.fire('¡Eliminado!', 'El tipo de ejercicio ha sido eliminado correctamente.', 'success');
                        this.exerciseTypes = this.exerciseTypes.filter(exerciseType => exerciseType.id !== exerciseTypeId);
                    },
                    error: (error) => {
                        const errorMessage =
                            error?.error?.error?.[0]?.errorMessage ||
                            'Hubo un problema al eliminar el tipo de ejercicio. Intente nuevamente.';
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
