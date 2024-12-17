import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Affection } from 'src/app/main/interfaces/affection.interface';
import { AffectionsService } from 'src/app/main/services/affection.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-affection-list',
    templateUrl: './affection-list.component.html',
    styleUrl: './affection-list.component.scss'
})
export class AffectionListComponent implements OnInit {

    affections: Affection[] = [];

    sortOptions: SelectItem[] = [];

    sortOrder: number = 0;

    sortField: string = '';

    constructor(private affectionService: AffectionsService) { }

    ngOnInit() {
        this.affectionService.getAffections()
            .subscribe(affections => {
                this.affections = affections.sort((a, b) => a.name.localeCompare(b.name));;
            })

        this.sortOptions = [
            { label: 'Price High to Low', value: '!price' },
            { label: 'Price Low to High', value: 'price' }
        ];
    }

    onSortChange(event: any) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }

    confirmDelete(affectionId: string): void {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el entrenador de manera permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                this.affectionService.deleteAffection(affectionId).subscribe({
                    next: () => {
                        Swal.fire('¡Eliminado!', 'El entrenador ha sido eliminado correctamente.', 'success');
                        this.affections = this.affections.filter(affection => affection.id !== +affectionId);
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
        });
    }

    onImageError(event: Event): void {
        const imgElement = event.target as HTMLImageElement;
        imgElement.src = 'assets/no-image.png'; // Ruta de la imagen predeterminada
    }
}
