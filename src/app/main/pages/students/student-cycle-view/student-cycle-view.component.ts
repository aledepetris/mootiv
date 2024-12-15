import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/main/interfaces/student.interface';
import { StudentsService } from 'src/app/main/services/students.service';
import Swal from 'sweetalert2';
import { StudentCycleService } from 'src/app/main/services/student.cycles.service';
import { GoalsService } from '../../../services/goal.service';
import { TrainingTypesService } from 'src/app/main/services/training-type.service';
import { CycleDetail } from 'src/app/main/interfaces/cycle.detail.interface';

@Component({
    selector: 'app-student-cycle',
    templateUrl: './student-cycle-view.component.html',
    styleUrls: ['./student-cycle-view.component.scss'],
})
export class StudentCycleViewComponent implements OnInit {

    student: Student;
    cycle: CycleDetail;

    constructor(
        private studentsService: StudentsService,
        private studentCycleService: StudentCycleService,
        private trainingTypesService: TrainingTypesService,
        private goalService: GoalsService,
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

    navigateTo(page: string): void {
        let path = `/${page}/${this.student.id}`;
        this.router.navigate([path]);
    }

    ngOnInit(): void {
        const studentId = this.activatedRoute.snapshot.params['idS'];
        const cycleId = this.activatedRoute.snapshot.params['idC'];

        if (studentId) {
            this.studentsService.getStudentById(studentId.toString()).subscribe({
                next: (data) => {
                    this.student = data;
                    if (cycleId) {
                        this.loadCycle(cycleId);
                    }
                },
                error: () => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo cargar el estudiante.',
                    }).then(() => this.router.navigate(['/students']));
                },
            });
        }
    }

    loadStudent(studentId: number): void {
        this.studentsService.getStudentById(studentId.toString()).subscribe({
            next: (data) => {
                console.log(data)
                this.student = data;
            },
            error: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cargar el estudiante.',
                }).then(() => this.router.navigate(['/students']));
            },
        });
    }

    loadCycle(cycleId: number): void {
        console.log("entro a loadCycle")
        this.studentCycleService.getCycleDetailById(+this.student.id, cycleId).subscribe({
            next: (data) => {
                this.cycle = data;
            },
            error: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cargar el estudiante.',
                }).then(() => this.router.navigate(['/students']));
            },
        });
    }
}
