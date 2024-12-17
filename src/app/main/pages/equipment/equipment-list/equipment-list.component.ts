import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { EquipmentsService } from 'src/app/main/services/equipment.service';
import Swal from 'sweetalert2';
import { Equipment } from '../../../interfaces/equipment.interface';

@Component({
    selector: 'app-equipment-list',
    templateUrl: './equipment-list.component.html',
    styleUrl: './equipment-list.component.scss'
})
export class EquipmentListComponent implements OnInit {

    equipments: Equipment[] = [];

    sortOptions: SelectItem[] = [];

    sortOrder: number = 0;

    sortField: string = '';

    constructor(private equipmentService: EquipmentsService) { }

    ngOnInit() {
        this.equipmentService.getEquipments()
            .subscribe(equipments => {
                this.equipments = equipments.sort((a, b) => a.name.localeCompare(b.name));
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

    confirmDelete(equipmentId: string): void {
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
                this.equipmentService.deleteEquipment(equipmentId).subscribe({
                    next: () => {
                        Swal.fire('¡Eliminado!', 'El entrenador ha sido eliminado correctamente.', 'success');
                        this.equipments = this.equipments.filter(equipment => equipment.id !== +equipmentId);
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
