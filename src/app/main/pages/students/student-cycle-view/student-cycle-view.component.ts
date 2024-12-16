import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/main/interfaces/student.interface';
import { StudentsService } from 'src/app/main/services/students.service';
import Swal from 'sweetalert2';
import { StudentCycleService } from 'src/app/main/services/student.cycles.service';
import { GoalsService } from '../../../services/goal.service';
import { TrainingTypesService } from 'src/app/main/services/training-type.service';
import { CycleDetail, ExerciseDetail, ExerciseRoutine, TrainingDay, TrainingWeek } from 'src/app/main/interfaces/cycle.detail.interface';
import { Template } from 'src/app/main/interfaces/template.interface';

@Component({
    selector: 'app-student-cycle',
    templateUrl: './student-cycle-view.component.html',
    styleUrls: ['./student-cycle-view.component.scss'],
})
export class StudentCycleViewComponent implements OnInit {

    templates: Template[] = [];
    selectedTemplate: Template | null = null;

    student: Student;
    cycle: CycleDetail;
    selectedDay: TrainingDay;
    selectedExercise: ExerciseRoutine;

    displayModal: boolean = false; // Visibilidad del modal
    isEditMode: boolean = false;   // Indica si se está editando un ejercicio
    newExercise: ExerciseRoutine = null; // Ejercicio que se está agregando o editando
    availableExercises: ExerciseDetail[] = []; // Lista de ejercicios disponibles

    constructor(
        private studentsService: StudentsService,
        private studentCycleService: StudentCycleService,
        private trainingTypesService: TrainingTypesService,
        private goalService: GoalsService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    navigateTo(page: string): void {
        let path = `/${page}/${this.student.id}`;
        this.router.navigate([path]);
    }

    viewNotes(exercise: ExerciseRoutine): void {
        const notes = exercise?.notes || 'Sin notas disponibles.';
        Swal.fire({
            title: 'Notas del Ejercicio',
            text: notes,
            icon: 'info',
            confirmButtonText: 'Cerrar'
        });
    }

    ngOnInit(): void {
        const studentId = this.activatedRoute.snapshot.params['idS'];
        const cycleId = this.activatedRoute.snapshot.params['idC'];

        if (studentId) {
            console.log('Llamando a loadTemplates'); // Log adicional
            this.loadTemplates(); // Carga las plantillas disponibles

            this.studentsService.getStudentById(studentId.toString()).subscribe({
                next: (data) => {
                    this.student = data;
                    if (cycleId) {
                        this.loadCycle(cycleId);
                    }
                    this.loadAvailableExercises();
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
        this.studentCycleService.getCycleDetailById(+this.student.id, cycleId).subscribe({
            next: (data) => {
                this.cycle = data;

                // Asegurar que `trainingWeeks` existe y ordenar por `id`
                this.cycle.trainingWeeks = (data.trainingWeeks || [])
                    .map(week => ({
                        ...week,
                        days: (week.days || [])
                            .map(day => ({
                                ...day,
                                exercises: (day.exercises || [])
                                    .map(exercise => ({
                                        ...exercise,
                                        exercise: exercise.exercise || {
                                            id: null,
                                            name: '',
                                            description: '',
                                            alt_img: '',
                                            forTime: false,
                                            total: false,
                                        }
                                    })
                                    )
                            }))
                            .sort((a, b) => (a.id || 0) - (b.id || 0)) // Ordenar los días por `id`
                    }))
                    .sort((a, b) => (a.id || 0) - (b.id || 0)); // Ordenar las semanas por `id`
            },
            error: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cargar el ciclo.',
                }).then(() => this.router.navigate(['/students']));
            },
        });
    }


    addExercise(day: TrainingDay): void {
        this.isEditMode = false;
        this.selectedDay = day; // Día al que se añadirá el ejercicio
        this.newExercise = {
            id: null,
            exercise: null,
            sets: 1,
            repetitions: 10,
            weight: 0,
            rest: 60,
            notes: ''
        };

        // Cargar los ejercicios disponibles antes de abrir el modal
        this.loadAvailableExercises(() => {
            this.displayModal = true; // Mostrar el modal solo después de cargar los datos
        });
    }

    editExercise(day: TrainingDay, exercise: ExerciseRoutine): void {
        this.isEditMode = true;
        this.selectedDay = day; // Día actual
        this.newExercise = { ...exercise }; // Copia profunda para evitar mutaciones
        this.displayModal = true;
    }

    closeModal(): void {
        this.displayModal = false;
        this.newExercise = null;
    }

    confirmAddExercise(): void {
        if (!this.newExercise.exercise) {
            Swal.fire('Error', 'Debe seleccionar un ejercicio.', 'error');
            return;
        }

        if (this.isEditMode) {
            // Editar el ejercicio existente
            const index = this.selectedDay.exercises.findIndex(e => e.id === this.newExercise.id);
            if (index !== -1) {
                this.selectedDay.exercises[index] = { ...this.newExercise };
            }
        } else {
            // Agregar nuevo ejercicio
            this.selectedDay.exercises.push(this.newExercise);
        }

        this.displayModal = false;
        Swal.fire('Éxito', `Ejercicio ${this.isEditMode ? 'editado' : 'agregado'} correctamente. Recuerda que todos los cambios se guardarán al hacer clic en "Guardar Todo".`, 'success');
    }

    // Cargar los ejercicios disponibles desde el backend
    loadAvailableExercises(callback?: () => void): void {
        this.studentCycleService.getAvailableExercises(+this.student.id, this.cycle.id).subscribe({
            next: (data) => {
                this.availableExercises = data;
                if (callback) {
                    callback(); // Ejecutar el callback si está definido
                }
            },
            error: (err) => {
                console.error('Error cargando ejercicios:', err);
                Swal.fire('Error', 'No se pudieron cargar los ejercicios disponibles.', 'error');
            }
        });
    }

    saveDay(day: TrainingDay): void {
        // Transformar los ejercicios al formato esperado por el backend
        const exercisesPayload = day.exercises.map(exercise => ({
            id: exercise.id || null,
            notes: exercise.notes || '',
            repetitions: exercise.repetitions,
            rest: exercise.rest,
            sets: exercise.sets,
            weight: exercise.weight,
            idExercise: exercise.exercise?.id
        }));

        // Llamar al servicio con el payload correcto
        this.studentCycleService.saveDayExercises(+this.student.id, day.id, { exercises: exercisesPayload }).subscribe({
            next: () => {
                Swal.fire('Éxito', 'Todos los ejercicios del día se han guardado correctamente.', 'success');
            },
            error: () => {
                Swal.fire('Error', 'No se pudieron guardar los ejercicios del día.', 'error');
            }
        });
    }

    deleteExercise(day: TrainingDay, exercise: ExerciseRoutine): void {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Este ejercicio será eliminado de la lista, pero los cambios se guardarán al hacer clic en "Guardar Todo".',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Eliminar del arreglo local
                const index = day.exercises.indexOf(exercise);
                if (index > -1) {
                    day.exercises.splice(index, 1);
                    Swal.fire('Eliminado', 'El ejercicio ha sido eliminado de la lista localmente.', 'success');
                }
            }
        });
    }

    finishDay(day: TrainingDay): void {
        if (!this.student || !day) {
            Swal.fire('Error', 'No se pudo determinar el estudiante o el día.', 'error');
            return;
        }

        // Llamar al servicio para finalizar el día
        this.studentCycleService.finishDay(+this.student.id, day.id).subscribe({
            next: () => {
                // Actualizar localmente la fecha de finalización
                day.finishDate = new Date(); // Asigna la fecha actual
                Swal.fire('Éxito', 'El día ha sido marcado como finalizado.', 'success');
            },
            error: () => {
                Swal.fire('Error', 'No se pudo finalizar el día. Intente nuevamente.', 'error');
            }
        });
    }

    getWeekRange(startDate: Date, daysToAdd: number = 7): string {
        if (!startDate) {
            return 'Sin fecha';
        }

        const start = new Date(startDate);
        const end = new Date(startDate);
        end.setDate(end.getDate() + daysToAdd);

        // Formatear las fechas (dd-MM-yy)
        const format = (date: Date): string =>
            date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });

        return ` ${format(start)}  al   ${format(end)} `;
    }

    advanceWeekStatus(week: TrainingWeek, newStatus: string): void {
        if (!week || !newStatus) {
            return;
        }
        // Llamar al servicio para actualizar el estado de la semana
        this.studentCycleService.updateWeekStatus(+this.student.id, week.id, newStatus).subscribe({
            next: () => {
                week.status = newStatus; // Actualizar el estado localmente
                Swal.fire('Éxito', `La semana ha sido actualizada a ${newStatus}.`, 'success');
            },
            error: () => {
                Swal.fire('Error', 'No se pudo actualizar el estado de la semana. Intente nuevamente.', 'error');
            }
        });
    }

    downloadFile(weekId: number, fileType: 'pdf' | 'csv'): void {
        this.studentCycleService.getFileForWeek(+this.student.id, this.cycle.id, weekId, fileType).subscribe({
            next: (base64Data) => {
                // Convierte el Base64 en un archivo descargable
                const contentType = fileType === 'pdf' ? 'application/pdf' : 'text/csv';
                const fileExtension = fileType === 'pdf' ? '.pdf' : '.csv';

                const byteCharacters = atob(base64Data); // Decodificar Base64
                const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
                const byteArray = new Uint8Array(byteNumbers);

                const blob = new Blob([byteArray], { type: contentType });
                const url = window.URL.createObjectURL(blob);

                // Crear el enlace de descarga
                const link = document.createElement('a');
                link.href = url;
                link.download = `Semana_${weekId}${fileExtension}`;
                link.click();

                // Limpiar la URL
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                console.error('Error descargando el archivo:', err);
                Swal.fire('Error', 'No se pudo descargar el archivo.', 'error');
            }
        });
    }

    loadTemplates(): void {
        console.log('loadTemplates ejecutado'); // Verifica si el método se llama
        this.studentCycleService.getTemplates().subscribe({
            next: (data) => {
                this.templates = data; // Verificar que los datos sean un arreglo
                console.log('Templates cargados:', this.templates); // Verifica si los datos llegan
            },
            error: (err) => {
                console.error('Error al cargar los templates:', err);
                Swal.fire('Error', 'No se pudieron cargar los templates disponibles.', 'error');
            }
        });
    }



    selectDay(day: TrainingDay): void {
        this.selectedDay = day;
    }

    onTemplateSelected(template: Template): void {
        if (!template || !this.selectedDay) {
            Swal.fire('Error', 'No se seleccionó ningún día o plantilla.', 'error');
            return;
        }

        // Concatenar los ejercicios del template con los ejercicios existentes en el día
        const newExercises = template.exercises.map(exercise => ({
            ...exercise,
            id: null // Aseguramos que el ID sea null porque no debe venir
        }));

        this.selectedDay.exercises = [...this.selectedDay.exercises, ...newExercises];

        Swal.fire('Éxito', 'Se agregaron los ejercicios del template al día seleccionado.', 'success');
    }

}
