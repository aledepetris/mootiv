import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Exercise } from '../../../interfaces/exercise.interface';
import { ExercisesService } from 'src/app/main/services/exercise.service';
import { EquipmentsService } from 'src/app/main/services/equipment.service';
import { ExerciseTypesService } from 'src/app/main/services/excercise-type.service';
import { TreeNode } from 'primeng/api';
import { MusclesService } from 'src/app/main/services/muscles.service';
import { Muscle } from 'src/app/main/interfaces/muscle.interface';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-exercise',
    templateUrl: './exercise.component.html',
    styleUrls: ['./exercise.component.scss'],
})
export class ExerciseComponent implements OnInit {

    exerciseForm: Exercise = {
        name: '',
        description: '',
        forTime: false,
        total: false,
        idsExercisesType: [],
        idsMuscles: [],
        idsEquipments: []
    };

    previewImage: string | null = "assets/no-image.png"

    exerciseTypes: any[] = []; // Lista para MultiSelect
    availableEquipments: any[] = []; // Equipos disponibles para PickList
    associatedEquipments: any[] = []; // Equipos asociados para PickList
    // Árbol de músculos
    musclesTree: TreeNode[] = [];
    // IDs de músculos seleccionados (para el backend)
    selectedMuscles: number[] = [];
    // Nodos seleccionados en el árbol (para el componente p-tree)
    treeSelectedNodes: TreeNode[] = []; cols = [{ field: 'name', header: 'Nombre' }];

    isEditMode: boolean = false;

    constructor(
        private exerciseService: ExercisesService,
        private equipmentService: EquipmentsService,
        private exerciseTypesService: ExerciseTypesService,
        private muscleService: MusclesService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const exerciseId = this.route.snapshot.paramMap.get('id');

        this.loadEquipments().then(() => {
            if (exerciseId) {
                this.isEditMode = true;
                this.loadExercise(+exerciseId).then(() => {
                    this.loadMuscles(); // Cargar los músculos después de cargar el ejercicio
                });
            } else {
                this.loadMuscles(); // Si no es edición, cargar los músculos directamente
            }
        });

        this.loadExerciseTypes();
    }




    loadMuscles(): void {
        this.muscleService.getMuscles().subscribe({
            next: (muscles: Muscle[]) => {
                this.musclesTree = this.buildMuscleTree(muscles);

                // Si estamos en modo edición, marcar los nodos seleccionados
                if (this.isEditMode && this.exerciseForm.idsMuscles.length > 0) {
                    this.markSelectedNodes(this.musclesTree, this.exerciseForm.idsMuscles);
                }
            },
            error: (error) => {
                console.error('Error al cargar músculos:', error);
            },
        });
    }



    buildMuscleTree(muscles: Muscle[]): TreeNode[] {
        return muscles
            .filter((muscle) => muscle && muscle.id) // Filtrar datos inválidos
            .map((muscle) => ({
                data: { id: muscle.id!, name: muscle.name },
                children: muscle.muscles ? this.buildMuscleTree(muscle.muscles) : [],
                expanded: true // Desplegar este nodo por defecto
            }));
    }


    markSelectedNodes(tree: TreeNode[], selectedIds: number[]): void {
        tree.forEach((node) => {
            if (selectedIds.includes(node.data.id)) {
                this.treeSelectedNodes.push(node); // Vinculado al p-tree
                this.selectedMuscles.push(node.data.id); // IDs para el backend
            }
            if (node.children && node.children.length > 0) {
                this.markSelectedNodes(node.children, selectedIds);
            }
        });
    }

    onTreeSelectionChange(event: TreeNode[]): void {
        this.treeSelectedNodes = event;
        this.selectedMuscles = event.map((node) => node.data.id); // Actualizar los IDs seleccionados
    }


    /**
     * Cargar los tipos de ejercicio para el MultiSelect.
     */
    loadExerciseTypes(): void {
        this.exerciseTypesService.getExerciseTypes().subscribe({
            next: (data) => {
                this.exerciseTypes = data; // Asigna los tipos de ejercicio
            },
            error: (err) => {
                console.error('Error al cargar tipos de ejercicio:', err);
            },
        });
    }

    loadEquipments(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.equipmentService.getEquipments().subscribe({
                next: (equipments) => {
                    this.availableEquipments = equipments; // Cargar todos los equipamientos
                    resolve();
                },
                error: (err) => {
                    console.error('Error al cargar los equipamientos:', err);
                    this.handleBackendError(err);
                    reject(err);
                },
            });
        });
    }



    loadExercise(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.exerciseService.getExerciseById(id).subscribe({
                next: (exercise) => {
                    this.exerciseForm = {
                        ...exercise,
                        forTime: exercise.forTime, // Mapear isForTime a forTime
                        total: !exercise.total, // Invertir el valor para el formulario
                    };

                    // Actualizar la vista previa de la imagen
                    this.previewImage = exercise.alt_img || 'assets/no-image.png';

                    // Manejar tipos de ejercicio (idsExercisesType)
                    this.exerciseForm.idsExercisesType = this.exerciseTypes.filter((type) =>
                        exercise.idsExercisesType.includes(type.id)
                    );

                    // Manejar equipamientos
                    this.associatedEquipments = this.availableEquipments.filter((equipment) =>
                        exercise.idsEquipments.includes(equipment.id)
                    );

                    this.availableEquipments = this.availableEquipments.filter((equipment) =>
                        !exercise.idsEquipments.includes(equipment.id)
                    );

                    resolve();
                },
                error: (err) => {
                    console.error('Error al cargar ejercicio:', err);
                    this.handleBackendError(err);
                    reject(err);
                },
            });
        });
    }







    onSubmit(): void {
        if (!this.exerciseForm.name || !this.exerciseForm.description) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor complete todos los campos antes de guardar.',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        const payload = {
            ...this.exerciseForm,
            isForTime: this.exerciseForm.forTime, // Mapear forTime a isForTime
            isTotal: !this.exerciseForm.total, // Mapear total a isTotal
            idsExercisesType: this.exerciseForm.idsExercisesType.map((type: any) => type.id), // Extraer solo los IDs
            idsEquipments: this.associatedEquipments.map((equipment) => equipment.id), // IDs de equipamientos
            idsMuscles: this.selectedMuscles, // IDs de músculos seleccionados
        };

        if (this.isEditMode) {
            this.exerciseService.updateExercise(this.exerciseForm.id, payload).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Ejercicio actualizado!',
                        text: 'El ejercicio se actualizó correctamente.',
                        confirmButtonText: 'Aceptar',
                    }).then(() => {
                        this.router.navigate(['/exercises']);
                    });
                },
                error: (err) => {
                    this.handleBackendError(err);
                },
            });
        } else {
            this.exerciseService.postExercise(payload).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Ejercicio creado!',
                        text: 'El ejercicio se creó correctamente.',
                        confirmButtonText: 'Aceptar',
                    }).then(() => {
                        this.router.navigate(['/exercises']);
                    });
                },
                error: (err) => {
                    this.handleBackendError(err);
                },
            });
        }
    }

    private handleBackendError(error: any): void {
        const errorMessage = error?.error?.message || 'Hubo un error al procesar la solicitud.';
        console.log(error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonText: 'Aceptar',
        });
    }

    onAltImageChange(event: Event): void {
        const input = (event.target as HTMLInputElement).value;
        this.previewImage = input || 'assets/no-image.png';
    }

    onImageError(): void {
        this.previewImage = 'assets/no-image.png';
    }
}
