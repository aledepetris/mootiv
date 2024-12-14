import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Student } from 'src/app/main/interfaces/student.interface';
import { DatePipe } from '@angular/common'; // Importa DatePipe
import { StudentsService } from 'src/app/main/services/students.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-student-view',
    templateUrl: './student-view.component.html',
    styleUrls: ['./student-view.component.scss'],
    providers: [DatePipe], // Agrega DatePipe como proveedor

})
export class StudentViewComponent implements OnInit {
    student: Student;

    constructor(
        private studentsService: StudentsService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    cards = [
        {
            title: 'Plan de Entrenamiento',
            image: 'assets/images/training-plan.jpg',
            route: '/student/training-plan',
        },
        {
            title: 'Historia Clínica',
            image: 'assets/images/clinical-history.jpg',
            route: '/student/history',
        },
        {
            title: 'Medidas',
            image: 'assets/images/measurements.jpg',
            route: '/student/measurements',
        },
        {
            title: 'Lugar de Entrenamiento',
            image: 'assets/images/training-location.jpg',
            route: '/student/training-location',
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
        this.router.navigate([`/student/${this.student.id}/${page}`]);
    }
}
