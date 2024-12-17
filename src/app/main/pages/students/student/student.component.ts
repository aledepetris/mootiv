import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from 'src/app/main/services/students.service';
import { Student } from 'src/app/main/interfaces/student.interface';


@Component({
    selector: 'app-student',
    templateUrl: './student.component.html',
    styleUrl: './student.component.scss'
})
export class StudentComponent implements OnInit {

    studentOptions: { label: string; value: string }[] = [];
    isEditMode = false; // Indica si el formulario está en modo edición
    studentForm: Student = {
        dni: null,
        name: '',
        lastName: '',
        email: '',
        telephone: '',
        birthdate: null,
        active: false,
        startDate: null
    };

    constructor(
        private studentsService: StudentsService,
        private router: Router,
        private activatedRoute: ActivatedRoute

    ) { }

    ngOnInit(): void {
        this.loadStudents();

        // Verifica si es edición
        this.activatedRoute.params.subscribe((params) => {
            const studentId = params['id'];
            if (studentId) {
                this.isEditMode = true; // Activa el modo edición
                this.loadStudent(studentId);
            }
        });

    }

    loadStudents(): void {
        this.studentsService.getStudents().subscribe({
            next: (students) => {
                this.studentOptions = students.map(student => ({
                    label: `${student.name} ${student.lastName}`,
                    value: student.id || ''
                }));
            },
            error: (error) => {
                console.error('Error al cargar los estudiantes:', error);
            }
        });
    }

    onSubmit(): void {
        const studentId = this.activatedRoute.snapshot.params['id'];
        if (this.isEditMode) {
            // PUT para actualizar
            this.studentsService.updateStudent(studentId, this.studentForm).subscribe({
                next: (response) => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'El estudiante se actualizó correctamente.',
                        confirmButtonText: 'Aceptar',
                    }).then(() => {
                        this.router.navigate(['/students']);
                    });
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
        } else {
            // POST para crear
            this.studentsService.postStudent(this.studentForm).subscribe({
                next: (response) => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'El estudiante se creó correctamente.',
                        confirmButtonText: 'Aceptar',
                    }).then(() => {
                        this.router.navigate(['/students']);
                    });
                },
                error: (error) => {
                    const errorMessage =
                        error?.error?.error?.[0]?.errorMessage ||
                        'Hubo un problema al guardar los datos. Intente nuevamente.';
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: errorMessage,
                        confirmButtonText: 'Aceptar',
                    });
                },
            });
        }
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
                    active: student.active,
                    startDate: student.startDate ? new Date(student.startDate) : null

                };
            },
            error: (error) => {
                console.error('Error al cargar el estudiante:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cargar el estudiante. Intente nuevamente.',
                    confirmButtonText: 'Aceptar',
                }).then(() => {
                    this.router.navigate(['/students']);
                });
            },
        });
    }


}
