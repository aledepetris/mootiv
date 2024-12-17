import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/main/interfaces/student.interface';
import { StudentsService } from 'src/app/main/services/students.service';
import Swal from 'sweetalert2';
import { StudentCycleService } from 'src/app/main/services/student.cycles.service';
import { Goal, ScheduleGoal } from 'src/app/main/interfaces/goal.interface';
import { GoalsService } from '../../../services/goal.service';
import { TrainingTypesService } from 'src/app/main/services/training-type.service';

@Component({
    selector: 'app-student-cycle',
    templateUrl: './student-cycle.component.html',
    styleUrls: ['./student-cycle.component.scss'],
})
export class StudentCycleComponent implements OnInit {

    student: Student;
    cicleId: number;

    // Formulario del ciclo
    cycleForm = {
        startDate: null,
        weeks: null,
        status: 'BORRADOR' // Por defecto al crear
    };

    // Opciones para los campos
    goals: Goal[] = [];
    availableDays: any[] = [];
    availableTrainingTypes: any[] = [];
    selectedGoal: Goal;
    selectedDay: number;
    selectedTrainingType: number;

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
        console.log(path)
        this.router.navigate([path]);
    }

    ngOnInit(): void {
        const studentId = this.activatedRoute.snapshot.params['idS'];
        this.cicleId = this.activatedRoute.snapshot.params['idC'];

        if (studentId) {
            this.loadStudent(studentId);
        }
        // Cargar los objetivos primero, luego el ciclo
        this.loadGoals().then(() => {
            if (this.cicleId) {
                this.loadCycle();
            }
        });
    }

    loadStudent(studentId: number): void {
        this.studentsService.getStudentById(studentId.toString()).subscribe({
            next: (data) => {
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

    loadGoals(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.goalService.getGoals().subscribe({
                next: (data) => {
                    this.goals = data;
                    resolve(); // Resolver cuando se hayan cargado los objetivos
                },
                error: (error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudieron cargar los objetivos.',
                    });
                    reject(error);
                },
            });
        });
    }


    onGoalChange(event: any): void {
        const selectedGoal = event.value;
        if (!selectedGoal || !selectedGoal.scheduleGoals) {
            return;
        }

        this.availableDays = selectedGoal.scheduleGoals
            .map((schedule: ScheduleGoal) => ({
                label: schedule.day,
                value: schedule.day,
            }))
            .sort((a, b) => Number(a.value) - Number(b.value)); // Orden ascendente

        this.availableTrainingTypes = []; // Limpia los tipos de entrenamiento
        this.selectedDay = null; // Resetea días seleccionados
    }


    onDayChange(event: any): void {
        const selectedDay = event.value;
        const schedule = this.selectedGoal.scheduleGoals.find((s) => s.day === selectedDay);

        if (schedule) {
            this.trainingTypesService.getTrainingTypesByIds(schedule.idsTrainingTypes).subscribe({
                next: (trainingTypes) => {
                    this.availableTrainingTypes = trainingTypes.map((type) => ({
                        label: type.name,
                        value: type.id,
                    }));
                },
                error: (err) => {
                    console.error('Error al cargar tipos de entrenamiento:', err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudieron cargar los tipos de entrenamiento.',
                    });
                },
            });
        }
    }

    isFormValid(): boolean {
        return (
            !!this.cycleForm.startDate && // Asegura que la fecha esté definida
            this.cycleForm.weeks !== null &&
            this.cycleForm.weeks > 0 && // Cantidad de semanas mayor que 0
            !!this.selectedGoal && // Asegura que se seleccionó un objetivo
            !!this.selectedDay && // Asegura que el día esté definido
            !!this.selectedTrainingType // Asegura que el tipo de entrenamiento esté definido
        );
    }


    validateWeeks(): void {
        if (this.cycleForm.weeks < 0) {
            this.cycleForm.weeks = 0; // Restablecer a 0 si el usuario ingresa un valor negativo
        }
    }


    loadCycle(): void {
        this.studentCycleService.getCycleById(+this.student.id, this.cicleId).subscribe({
            next: (cycle) => {
                this.cycleForm = {
                    startDate: new Date(cycle.startDate), // Fecha de inicio
                    weeks: cycle.numberOfWeeks, // Número de semanas
                    status: cycle.status, // Estado del ciclo
                };

                // Encuentra el objetivo asociado al ciclo
                this.selectedGoal = this.goals.find((goal) => goal.id === cycle.idGoal);

                if (this.selectedGoal) {
                    // Carga los días relacionados al objetivo
                    this.onGoalChange({ value: this.selectedGoal });

                    // Espera a que los días estén cargados antes de asignar el seleccionado
                    setTimeout(() => {
                        this.selectedDay = cycle.numberOfDays; // Asigna el día seleccionado

                        // Encuentra los tipos de entrenamiento relacionados al día seleccionado
                        console.log(this.selectedGoal)
                        const schedule = this.selectedGoal.scheduleGoals.find(
                            (s) => s.day == this.selectedDay.toString()
                        );
                        console.log(schedule)

                        if (schedule) {
                            this.trainingTypesService.getTrainingTypesByIds(schedule.idsTrainingTypes).subscribe({
                                next: (trainingTypes) => {
                                    this.availableTrainingTypes = trainingTypes.map((type) => ({
                                        label: type.name,
                                        value: type.id,
                                    }));
                                    console.log(cycle)
                                    this.selectedTrainingType = cycle.idTrainingType; // Tipo de entrenamiento seleccionado
                                },
                                error: (err) => {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: 'No se pudieron cargar los tipos de entrenamiento.',
                                    });
                                },
                            });
                        }
                    }, 100); // Retraso para asegurar que los días estén listos
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'El objetivo asociado no se encontró.',
                    });
                }
            },
            error: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cargar el ciclo.',
                });
            },
        });
    }


    onSubmit(): void {
        if (!this.isFormValid()) {
            Swal.fire({
                icon: 'error',
                title: 'Formulario incompleto',
                text: 'Por favor, complete todos los campos antes de guardar.',
            });
            return;
        }

        const payload = {
            startDate: this.cycleForm.startDate,
            numberOfWeeks: this.cycleForm.weeks,
            idGoal: this.selectedGoal.id,
            numberOfDays: this.selectedDay,
            idTrainingType: this.selectedTrainingType,
            status: this.cycleForm.status,
        };

        if (this.cicleId) {
            // Modo edición
            this.studentCycleService.updateCycle(+this.student.id, this.cicleId, payload).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Ciclo actualizado!',
                        text: 'El ciclo se actualizó correctamente.',
                    }).then(() => this.router.navigate(['/students/plan/', this.student.id]));
                },
                error: (err) => {
                    const errorMessage = err?.error?.error?.[0]?.errorMessage || null;
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al actualizar',
                        text: errorMessage || 'Hubo un problema al actualizar el ciclo. Intente nuevamente.',
                    });
                },
            });
        } else {
            // Modo creación
            this.studentCycleService.postCycle(+this.student.id, payload).subscribe({
                next: () => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Ciclo creado!',
                        text: 'El ciclo se creó correctamente.',
                    }).then(() => this.router.navigate(['/students/plan/', this.student.id]));
                },
                error: (err) => {
                    const errorMessage = err?.error?.error?.[0]?.errorMessage || null;
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al crear',
                        text: errorMessage || 'Hubo un problema al crear el ciclo. Intente nuevamente.',
                    });
                },
            });
        }
    }

}
