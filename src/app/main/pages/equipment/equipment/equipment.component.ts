import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipmentsService } from 'src/app/main/services/equipment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-equipment-form',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss'],
})
export class EquipmentComponent implements OnInit {
  isEditMode = false; // Indica si el formulario está en modo edición
  equipmentForm = {
    name: '',
    description: '',
    alt_img: '',
  };
  previewImage: string | null = "assets/no-image.png"

  constructor(
    private equipmentsService: EquipmentsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Verifica si está en modo edición
    const equipmentId = this.activatedRoute.snapshot.params['id'];

    if (equipmentId) {
      this.isEditMode = true;
      this.loadEquipment(equipmentId); // Cargar datos del equipamiento
    }
  }

  loadEquipment(equipmentId: string): void {
    this.equipmentsService.getEquipmentById(equipmentId).subscribe({
      next: (equipment) => {
        this.equipmentForm = {
          name: equipment.name,
          description: equipment.description,
          alt_img: equipment.alt_img || '',
        };
        this.previewImage = equipment.alt_img;
      },
      error: (error) => {
        console.error('Error al cargar el equipamiento:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el equipamiento. Intente nuevamente.',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          this.router.navigate(['/equipments']);
        });
      },
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
        this.equipmentForm.alt_img = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      // Actualizar equipamiento
      const equipmentId = this.activatedRoute.snapshot.params['id'];
      this.equipmentsService.updateEquipment(equipmentId, this.equipmentForm).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El equipamiento se actualizó correctamente.',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            this.router.navigate(['/equipments']);
          });
        },
        error: (error) => {
          console.error('Error al actualizar el equipamiento:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el equipamiento. Intente nuevamente.',
            confirmButtonText: 'Aceptar',
          });
        },
      });
    } else {
      // Crear nuevo equipamiento
      this.equipmentsService.postEquipment(this.equipmentForm).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'El equipamiento se creó correctamente.',
            confirmButtonText: 'Aceptar',
          }).then(() => {
            this.router.navigate(['/equipments']);
          });
        },
        error: (error) => {
          console.error('Error al crear el equipamiento:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear el equipamiento. Intente nuevamente.',
            confirmButtonText: 'Aceptar',
          });
        },
      });
    }
  }

  onAltImageChange(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.previewImage = input || 'assets/no-image.png';
  }

  onImageError(): void {
    this.previewImage = 'assets/no-image.png';
  }



}
