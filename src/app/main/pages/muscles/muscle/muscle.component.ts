import { Component, OnInit } from '@angular/core';
import { MusclesService } from '../../../services/muscles.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Muscle } from 'src/app/main/interfaces/muscle.interface';
import { TreeNode } from 'primeng/api';

@Component({
    selector: 'app-muscle',
    templateUrl: './muscle.component.html',
    styleUrls: ['./muscle.component.scss']
})
export class MuscleComponent implements OnInit {

    musclesTree: TreeNode[] = [];
    displayModal: boolean = false; // Control del modal
    isEditMode: boolean = false; // Modo edición o creación
    selectedNode: TreeNode | null = null; // Nodo seleccionado
    muscleForm: Muscle = { name: '', muscles: [] }; // Formulario para crear/editar músculo

    constructor(
        private musclesService: MusclesService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadMuscles();
    }

    loadMuscles(): void {
        this.musclesService.getMuscles().subscribe({
            next: (muscles: Muscle[]) => {
                this.musclesTree = this.buildMuscleTree(muscles);
            },
            error: (error) => {
                console.error('Error al cargar músculos:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al cargar los músculos.',
                    confirmButtonText: 'Aceptar',
                });
            },
        });
    }

    buildMuscleTree(muscles: Muscle[]): TreeNode[] {
        return muscles.map((muscle) => ({
            data: { id: muscle.id, name: muscle.name },
            children: muscle.muscles ? this.buildMuscleTree(muscle.muscles) : [],
            expanded: true, // Nodos desplegados por defecto
        }));
    }

    // Crear un nodo hijo
    onCreateNode(parentNode: TreeNode): void {
        this.isEditMode = false;
        this.selectedNode = parentNode;
        this.muscleForm = {
            name: '',
            muscles: []
        };
        this.displayModal = true;
    }

    // Editar un nodo existente
    onEditNode(node: TreeNode): void {
        this.isEditMode = true;
        this.selectedNode = node;
        this.muscleForm = { id: node.data.id, name: node.data.name, muscles: [] };
        this.displayModal = true;
    }

    // Guardar el nodo (Crear/Editar)
    onSaveNode(): void {
        if (!this.muscleForm.name.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo vacío',
                text: 'Por favor, ingrese un nombre para el músculo.',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        if (this.isEditMode && this.selectedNode) {
            // Editar nodo
            this.musclesService.updateMuscle(this.muscleForm.id!, this.muscleForm).subscribe({
                next: () => {
                    this.selectedNode!.data.name = this.muscleForm.name; // Actualizar nodo en el árbol
                    this.displayModal = false;
                    Swal.fire('¡Actualizado!', 'El músculo fue actualizado con éxito.', 'success');
                },
                error: (error) => {
                    console.error('Error al actualizar el músculo:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un problema al actualizar el músculo.',
                        confirmButtonText: 'Aceptar',
                    });
                },
            });
        } else if (this.selectedNode) {
            // Crear nodo hijo
            const newMuscle = { ...this.muscleForm, idParentMuscle: this.selectedNode.data.id }; // Asociar al padre
            this.musclesService.postMuscle(newMuscle).subscribe({
                next: (createdMuscle: Muscle) => {
                    // Añadir nuevo nodo al árbol
                    this.selectedNode!.children.push({
                        data: { id: createdMuscle.id, name: createdMuscle.name },
                        children: [],
                    });
                    this.displayModal = false;
                    Swal.fire('¡Creado!', 'El músculo fue creado con éxito.', 'success');
                },
                error: (error) => {
                    console.error('Error al crear el músculo:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un problema al crear el músculo.',
                        confirmButtonText: 'Aceptar',
                    });
                },
            });
        }
    }

    // Eliminar un nodo
    onDeleteNode(node: TreeNode): void {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el músculo y sus hijos.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                this.musclesService.deleteMuscle(node.data.id).subscribe({
                    next: () => {
                        // Eliminar nodo del árbol
                        this.musclesTree = this.musclesTree.filter(
                            (treeNode) => treeNode !== node
                        );
                        Swal.fire('¡Eliminado!', 'El músculo ha sido eliminado.', 'success');
                    },
                    error: (error) => {
                        console.error('Error al eliminar el músculo:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un problema al eliminar el músculo.',
                            confirmButtonText: 'Aceptar',
                        });
                    },
                });
            }
        });
    }

    onCancel(): void {
        this.displayModal = false;
    }
}
