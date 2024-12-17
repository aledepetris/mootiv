import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from 'src/app/main/services/students.service';
import { Student } from 'src/app/main/interfaces/student.interface';

@Component({
    selector: 'app-student',
    templateUrl: './student.component.html',
    styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

    isEditMode = false; // Indica si está en modo edición
    defaultPhoto: string = 'assets/no-image.png'; // Imagen por defecto
    photoUrl: string = ''; // URL dinámica para la imagen del estudiante
    selectedStudents: number[] = [];

    studentOptions: { label: string; value: string }[] = [];
    studentForm: Student = {
        dni: null,
        name: '',
        lastName: '',
        email: '',
        telephone: '',
        birthdate: null,
        alt_img: '',
        startDate: null
    };

    constructor(
        private studentsService: StudentsService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        // Verifica si es edición
        this.activatedRoute.params.subscribe((params) => {
            const studentId = params['id'];
            if (studentId) {
                this.isEditMode = true;
                this.loadStudent(studentId);
            }
        });

        this.photoUrl = this.studentForm.alt_img || this.defaultPhoto;
    }

    loadStudent(studentId: string): void {
        this.studentsService.getStudentById(studentId).subscribe({
            next: (student) => {
                this.studentForm = {
                    dni: Number(student.dni),
                    name: student.name,
                    lastName: student.lastName,
                    email: student.email,
                    telephone: student.telephone,
                    birthdate: student.birthdate ? new Date(student.birthdate) : null,
                    startDate: student.startDate ? new Date(student.startDate) : null,
                    alt_img: student.alt_img || ''
                };
                this.photoUrl = this.studentForm.alt_img || this.defaultPhoto;
            },
            error: () => {
                Swal.fire('Error', 'No se pudo cargar el estudiante.', 'error').then(() => {
                    this.router.navigate(['/students']);
                });
            }
        });
    }

    onSubmit(): void {
        this.studentForm.alt_img = this.photoUrl; // Actualiza la URL de la foto

        const studentId = this.activatedRoute.snapshot.params['id'];
        const request = this.isEditMode
            ? this.studentsService.updateStudent(studentId, this.studentForm)
            : this.studentsService.postStudent(this.studentForm);

        request.subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: `El estudiante se ha ${this.isEditMode ? 'actualizado' : 'creado'} correctamente.`,
                }).then(() => this.router.navigate(['/students']));
            },
            error: () => {
                Swal.fire('Error', 'Hubo un problema al guardar los datos. Intente nuevamente.', 'error');
            }
        });
    }

    // Actualiza la URL de la foto dinámicamente
    updatePhotoUrl(event: string): void {
        this.photoUrl = event || this.defaultPhoto;
    }

    // Fallback si la imagen falla
    onImageError(): void {
        this.photoUrl = this.defaultPhoto;
    }
}
