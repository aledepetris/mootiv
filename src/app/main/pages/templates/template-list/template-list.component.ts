import { Component, OnInit } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { Template } from 'src/app/main/interfaces/template.interface';
import { ExercisesService } from 'src/app/main/services/exercise.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-template-list',
    templateUrl: './template-list.component.html',
    styleUrl: './template-list.component.scss'
})
export class TemplateListComponent implements OnInit {

    templates: Template[] = [];

    constructor(private exerciseService: ExercisesService) { }

    ngOnInit() {
        this.exerciseService.getExercisesTemplate()
            .subscribe(templates => {
                this.templates = templates;
            })

    }

    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }

    confirmDelete(templateId: string): void {
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
                this.exerciseService.deleteExerciseTemplate(+templateId).subscribe({
                    next: () => {
                        Swal.fire('¡Eliminado!', 'El template ha sido eliminado correctamente.', 'success');
                        this.templates = this.templates.filter(template => template.id !== +templateId);
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

}
