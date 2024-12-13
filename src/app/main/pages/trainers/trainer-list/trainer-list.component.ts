import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Trainer } from 'src/app/main/interfaces/trainer.interface';
import { TrainersService } from 'src/app/main/services/trainers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-trainer-list',
  templateUrl: './trainer-list.component.html',
  styleUrl: './trainer-list.component.scss'
})
export class TrainerListComponent implements OnInit {

    trainers: Trainer[] = [];

    sortOptions: SelectItem[] = [];

    sortOrder: number = 0;

    sortField: string = '';

    constructor(private trainerService: TrainersService) { }

    ngOnInit() {
        this.trainerService.getTrainers()
            .subscribe( trainers => {
                this.trainers = trainers;
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

    confirmDelete(trainerId: string): void {
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
            this.trainerService.deleteTrainer(trainerId).subscribe({
              next: () => {
                Swal.fire('¡Eliminado!', 'El entrenador ha sido eliminado correctamente.', 'success');
                this.trainers = this.trainers.filter(trainer => trainer.id !== +trainerId);
            },
              error: (error) => {
                Swal.fire('Error', 'No se pudo eliminar el entrenador. Intenta nuevamente.', 'error');
                console.error('Error al eliminar:', error);
              },
            });
          }
        });
      }

}
