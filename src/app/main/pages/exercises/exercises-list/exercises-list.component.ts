import { Component, OnInit } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { Exercise } from '../../../interfaces/exercise.interface';
import { ExercisesService } from 'src/app/main/services/exercise.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-exercises-list',
    templateUrl: './exercises-list.component.html',
    styleUrl: './exercises-list.component.scss'
})
export class ExerciseListComponent implements OnInit {

    exercises: Exercise[] = [];

    constructor(private exercisesService: ExercisesService) { }

    ngOnInit(): void {
        this.loadExercises();
    }

    loadExercises(): void {
        this.exercisesService.getExercises().subscribe({
            next: (data: Exercise[]) => {
                this.exercises = data;
            },
            error: (err) => {
                console.error('Error al cargar los ejercicios:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar los ejercicios. Intente nuevamente más tarde.',
                    confirmButtonText: 'Aceptar',
                });
            },
        });
    }

    confirmDelete(id: number): void {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas eliminar este ejercicio? Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteExercise(id);
            }
        });
    }


    deleteExercise(id: number): void {
        this.exercisesService.deleteExercise(id).subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Ejercicio eliminado!',
                    text: 'El ejercicio ha sido eliminado correctamente.',
                    confirmButtonText: 'Aceptar',
                });
                this.exercises = this.exercises.filter((exercise) => exercise.id !== id);
            },
            error: (err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err?.error?.[0]?.errorMessage || 'No se pudo eliminar el ejercicio. Intente nuevamente más tarde.',
                    confirmButtonText: 'Aceptar',
                });
            },
        });
    }

    onFilter(dv: DataView, event: Event): void {
        dv.filter((event.target as HTMLInputElement).value);
    }
}
