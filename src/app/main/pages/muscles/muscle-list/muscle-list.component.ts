import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { Muscle } from 'src/app/main/interfaces/muscle.interface';
import { MusclesService } from 'src/app/main/services/muscles.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-muscle-list',
    templateUrl: './muscle-list.component.html',
    styleUrls: ['./muscle-list.component.scss']
})
export class MuscleListComponent implements OnInit {

    musclesTree: TreeNode[] = [];

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
            data: { id: muscle.id, name: muscle.name, muscles: muscle.muscles },
            children: muscle.muscles ? this.buildMuscleTree(muscle.muscles) : [],
            expanded: true,
        }));
    }

    onEditNode(node: TreeNode): void {
        this.router.navigate(['/muscles', node.data.id]); // Navegar a la pantalla de edición
    }

    onNewNode(): void {
        this.router.navigate(['/muscles/new']); // Navegar a la pantalla de creación
    }

    confirmDeleteNode(node: TreeNode): void {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el músculo seleccionado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.onDeleteNode(node);
            }
        });
    }

    onDeleteNode(node: TreeNode): void {
        this.musclesService.deleteMuscle(node.data.id).subscribe({
            next: () => {
                Swal.fire('¡Eliminado!', 'El músculo ha sido eliminado correctamente.', 'success');
            },
            error: (error) => {
                const errorMessage =
                    error?.error?.error?.[0]?.errorMessage ||
                    'Hubo un problema al actualizar los datos. Intente nuevamente.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                    confirmButtonText: 'Aceptar',
                });
            },
        });
    }
}
