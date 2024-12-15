import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/main/interfaces/student.interface';
import { StudentsService } from 'src/app/main/services/students.service';
import Swal from 'sweetalert2';
import { Cycle } from 'src/app/main/interfaces/cycle.interface';
import { StudentCycleService } from 'src/app/main/services/student.cycles.service';

@Component({
    selector: 'app-student-plan',
    templateUrl: './student-plan.component.html',
    styleUrls: ['./student-plan.component.scss'],
})
export class StudentPlanComponent implements OnInit {
    student: Student;
    cicles: Cycle[] = [];
    loading: boolean = false;

    constructor(
        private studentsService: StudentsService,
        private studentCycleService: StudentCycleService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    menuItems = [
        { title: 'Dashboard Alumno', route: 'students/view', icon: 'pi pi-home' },
        { title: 'Plan de Entrenamiento', route: 'students/plan', icon: 'pi pi-calendar' },
        { title: 'Revisar Historia Clínica', route: 'students/condition', icon: 'pi pi-book' },
        { title: 'Medidas Antropométricas', route: 'students/measure', icon: 'pi pi-chart-bar' },
        { title: 'Lugar de Entrenamiento', route: 'students/location', icon: 'pi pi-map' },
    ];

    ngOnInit(): void {
        const studentId = this.activatedRoute.snapshot.params['id'];
        if (studentId) {
            this.studentsService.getStudentById(studentId).subscribe({
                next: (data) => {
                    this.student = data;
                    this.loadCycles();
                },
                error: (error) => {
                    console.error('Error al cargar estudiante:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo cargar el estudiante.',
                        confirmButtonText: 'Aceptar',
                    }).then(() => this.router.navigate(['/students']));
                },
            });
        }
    }

    loadCycles(): void {
        this.loading = true;
        this.studentCycleService.getCycles(+this.student.id).subscribe({
            next: (cycles) => {
                this.cicles = cycles;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error al cargar ciclos:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar los ciclos. Intente nuevamente.',
                    confirmButtonText: 'Aceptar',
                });
                this.loading = false;
            },
        });
    }

    openNewCycle(): void {
        this.router.navigate([`/students/plan/${this.student.id}/cycle`]);
    }

    editCycle(cycleId: number): void {
        this.router.navigate([`/students/plan/${this.student.id}/cycle/${cycleId}`]);
    }

    confirmDelete(cycleId: number): void {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas eliminar este ciclo? Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteCycle(cycleId);
            }
        });
    }

    navigateTo(page: string): void {
        let path = `/${page}/${this.student.id}`;
        console.log(path)
        this.router.navigate([path]);
    }

    deleteCycle(cycleId: number): void {
        this.studentCycleService.deleteCycle(+this.student.id, cycleId).subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Ciclo eliminado!',
                    text: 'El ciclo fue eliminado correctamente.',
                    confirmButtonText: 'Aceptar',
                });
                this.cicles = this.cicles.filter(cycle => cycle.id !== cycleId);
            },
            error: (err) => {
                const errorMessage = err?.error?.error?.[0]?.errorMessage || null;
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage || 'No se pudo eliminar el ciclo. Intente nuevamente.',
                    confirmButtonText: 'Aceptar',
                });
            },
        });
    }

    updateCycleStatus(idCycle: number, newStatus: string): void {
        this.studentCycleService.updateCycleStatus(+this.student.id, idCycle, newStatus).subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Estado Actualizado!',
                    text: `El ciclo ha cambiado a ${newStatus}.`,
                    confirmButtonText: 'Aceptar',
                });
                this.loadCycles(); // Recargar los ciclos para reflejar los cambios
            },
            error: (err) => {
                const errorMessage = err?.error?.error?.[0]?.errorMessage || 'Hubo un problema al actualizar el estado.';
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                    confirmButtonText: 'Aceptar',
                });
            },
        });
    }

    viewDetails(cycleId: number): void {
        let path = `/students/plan/${this.student.id}/cycle/${cycleId}/view/`
        console.log(path)
        this.router.navigate([path]);
    }

}
