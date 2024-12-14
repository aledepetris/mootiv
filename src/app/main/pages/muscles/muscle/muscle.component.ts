import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Muscle } from '../../../interfaces/muscle.interface';
import { MusclesService } from 'src/app/main/services/muscles.service';

@Component({
    selector: 'app-muscle',
    templateUrl: './muscle.component.html',
    styleUrls: ['./muscle.component.scss'],
})
export class MuscleComponent implements OnInit {
    isEditMode = false;
    isGroup = false;
    hasAssociatedMuscles = false;

    // Formulario
    muscleForm: Muscle = {
        name: '',
        idParentMuscle: null,
        muscles: [],
    };

    // PickList Datos
    parentMuscles: Muscle[] = [];
    musclesToPick: Muscle[] = [];
    musclesAssociated: Muscle[] = [];

    constructor(
        private musclesService: MusclesService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((params) => {
            const muscleId = params['id'];
            if (muscleId) {
                this.isEditMode = true;
                this.loadMuscleAndAssociated(muscleId);
            } else {
                this.loadAvailableMuscles();
            }
        });
    }

    loadMuscleAndAssociated(id: number): void {
        Promise.all([
            this.musclesService.getMuscles().toPromise(),
            this.musclesService.getMuscleById(id).toPromise(),
        ])
            .then(([muscles, muscle]) => {
                this.parentMuscles = muscles.filter((m) => m.muscles && m.muscles.length > 0);
                this.musclesToPick = muscles;
                this.muscleForm = { ...muscle };

                this.hasAssociatedMuscles = !!muscle.muscles && muscle.muscles.length > 0;
                this.isGroup = this.hasAssociatedMuscles;

                if (this.hasAssociatedMuscles) {
                    this.musclesAssociated = muscles.filter((m) => muscle.muscles.includes(m));
                    this.musclesToPick = this.musclesToPick.filter((m) => !muscle.muscles.includes(m));
                }
            })
            .catch((error) => {
                console.error('Error al cargar datos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al cargar los datos.',
                    confirmButtonText: 'Aceptar',
                }).then(() => this.router.navigate(['/muscles']));
            });
    }

    loadAvailableMuscles(): void {
        this.musclesService.getMuscles().subscribe({
            next: (muscles) => {
                this.musclesToPick = muscles;
                this.parentMuscles = muscles.filter((m) => m.muscles && m.muscles.length > 0);
            },
            error: (error) => {
                console.error('Error al cargar los músculos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al cargar los músculos.',
                    confirmButtonText: 'Aceptar',
                });
            },
        });
    }

    onGroupChange(): void {
        if (!this.isGroup) {
            this.musclesAssociated = [];
        }
    }

    onSubmit(): void {
        if (!this.muscleForm.name) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor complete todos los campos antes de guardar.',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        const payload: Muscle = {
            ...this.muscleForm,
            muscles: this.isGroup ? this.musclesAssociated : null,
        };

        if (this.isEditMode) {
            this.musclesService.updateMuscle(this.muscleForm.id!, payload).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'El músculo se actualizó correctamente.',
                        confirmButtonText: 'Aceptar',
                    }).then(() => this.router.navigate(['/muscles']));
                },
                error: (error) => {
                    console.error('Error al actualizar el músculo:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un problema al actualizar los datos.',
                        confirmButtonText: 'Aceptar',
                    });
                },
            });
        } else {
            this.musclesService.postMuscle(payload).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'El músculo se creó correctamente.',
                        confirmButtonText: 'Aceptar',
                    }).then(() => this.router.navigate(['/muscles']));
                },
                error: (error) => {
                    console.error('Error al crear el músculo:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un problema al guardar los datos.',
                        confirmButtonText: 'Aceptar',
                    });
                },
            });
        }
    }
}
