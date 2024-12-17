import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Student } from 'src/app/main/interfaces/student.interface';
import { StudentsService } from 'src/app/main/services/students.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-student-list',
    templateUrl: './student-list.component.html',
    styleUrl: './student-list.component.scss'
})
export class StudentListComponent implements OnInit {

    students: Student[] = [];

    sortOptions: SelectItem[] = [];

    sortOrder: number = 0;

    sortField: string = '';

    constructor(private studentService: StudentsService) { }

    ngOnInit() {
        this.studentService.getStudents()
            .subscribe(students => {
                this.students = students;
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

    onFilter(dv: any, event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
        dv.filter(filterValue, 'fullName', 'contains');
    }

    confirmDelete(studentId: string): void {
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
                this.studentService.deleteStudent(studentId).subscribe({
                    next: () => {
                        Swal.fire('¡Eliminado!', 'El entrenador ha sido eliminado correctamente.', 'success');
                        this.students = this.students.filter(student => student.id !== studentId);
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
