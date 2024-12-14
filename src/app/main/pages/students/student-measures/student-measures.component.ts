import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/main/interfaces/student.interface';
import { DatePipe } from '@angular/common'; // Importa DatePipe
import { StudentsService } from 'src/app/main/services/students.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-student-condition',
    templateUrl: './student-measures.component.html',
    styleUrls: ['./student-measures.component.scss'],
    providers: [DatePipe],

})
export class StudentMeasureComponent implements OnInit {
    student: Student;

    constructor(
        private studentsService: StudentsService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    menuItems = [
        {
            title: 'Dashboard Alumno',
            route: 'students/view',
            icon: 'pi pi-home'
        },
        {
            title: 'Plan de Entrenamiento',
            route: 'students/plan',
            icon: 'pi pi-calendar'
        },
        {
            title: 'Revisar Historia Clínica',
            route: 'students/condition',
            icon: 'pi pi-book'
        },
        {
            title: 'Medidas Antropométricas',
            route: 'students/measure',
            icon: 'pi pi-chart-bar'
        },
        {
            title: 'Lugar de Entrenamiento',
            route: 'students/location',
            icon: 'pi pi-map'
        },
    ];

    ngOnInit(): void {
        const studentId = this.activatedRoute.snapshot.params['id'];
        if (studentId) {
            this.studentsService.getStudentById(studentId).subscribe({
                next: (data) => {
                    this.student = data;
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

    navigateTo(page: string): void {
        let path = `/${page}/${this.student.id}`;
        console.log(path)
        this.router.navigate([path]);
    }
}
