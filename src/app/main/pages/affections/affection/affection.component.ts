import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Muscle } from 'src/app/main/interfaces/muscle.interface';
import { Affection } from 'src/app/main/interfaces/affection.interface';
import { MusclesService } from 'src/app/main/services/muscles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AffectionsService } from 'src/app/main/services/affection.service';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-affection',
    templateUrl: './affection.component.html',
    styleUrls: ['./affection.component.scss'],
})
export class AffectionComponent implements OnInit {
    isEditMode = false;

    // Formulario
    affectionForm: Affection = {
        name: '',
        description: '',
        idsMusclesAffected: [],
    };

    // Árbol de músculos
    musclesTree: TreeNode[] = [];
    // IDs de músculos seleccionados (para el backend)
    selectedMuscles: number[] = [];
    // Nodos seleccionados en el árbol (para el componente p-tree)
    treeSelectedNodes: TreeNode[] = []; cols = [{ field: 'name', header: 'Nombre' }];

    constructor(
        private musclesService: MusclesService,
        private affectionsService: AffectionsService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        // Verificar si es edición
        this.activatedRoute.params.subscribe((params) => {
            const affectionId = params['id'];
            if (affectionId) {
                this.isEditMode = true;
                this.loadAffection(affectionId);
            }
        });

        // Cargar músculos para el árbol
        this.loadMuscles();
    }

    loadMuscles(): void {
        this.musclesService.getMuscles().subscribe({
            next: (muscles: Muscle[]) => {
                this.musclesTree = this.buildMuscleTree(muscles);

                // Si estamos en modo edición, marcar los nodos seleccionados
                if (this.isEditMode && this.affectionForm.idsMusclesAffected.length > 0) {
                    this.markSelectedNodes(this.musclesTree, this.affectionForm.idsMusclesAffected);
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



    loadAffection(id: number): void {
        this.affectionsService.getAffectionById(id).subscribe({
            next: (affection: Affection) => {
                this.affectionForm = affection;
                this.selectedMuscles = []; // Resetear selección previa
                // Marcar los nodos en el árbol
                if (affection.idsMusclesAffected && affection.idsMusclesAffected.length > 0) {
                    this.markSelectedNodes(this.musclesTree, affection.idsMusclesAffected);
                }
            },
            error: (error) => {
                console.error('Error al cargar afección:', error);
            },
        });
    }

    onTreeSelectionChange(event: any): void {
        this.treeSelectedNodes = event; // Aquí solo guardamos los nodos seleccionados.
    }


    onSubmit(): void {
        const muscleIds = this.treeSelectedNodes.map((node: TreeNode) => node.data.id);

        const affectionRequest: Affection = {
            id: this.affectionForm.id,
            name: this.affectionForm.name,
            description: this.affectionForm.description,
            idsMusclesAffected: muscleIds,
        };

        if (this.isEditMode) {
            this.affectionsService.updateAffection(affectionRequest.id, affectionRequest).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'La afección se actualizó correctamente.',
                        confirmButtonText: 'Aceptar',
                    }).then(() => this.router.navigate(['/affections']));
                },
                error: (error) => {
                    console.error('Error al actualizar:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo actualizar la afección. Intente nuevamente.',
                    });
                },
            });
        } else {
            this.affectionsService.postAffection(affectionRequest).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'La afección se creó correctamente.',
                        confirmButtonText: 'Aceptar',
                    }).then(() => this.router.navigate(['/affections']));
                },
                error: (error) => {
                    console.error('Error al crear:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo crear la afección. Intente nuevamente.',
                    });
                },
            });
        }
    }
}
