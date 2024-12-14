import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/main/interfaces/student.interface';
import { DatePipe } from '@angular/common'; // Importa DatePipe
import { StudentsService } from 'src/app/main/services/students.service';
import Swal from 'sweetalert2';
import { StudentMeasureService } from 'src/app/main/services/student.measure.service';
import { Measure } from 'src/app/main/interfaces/measure.interface';

@Component({
    selector: 'app-student-condition',
    templateUrl: './student-measures.component.html',
    styleUrls: ['./student-measures.component.scss'],
    providers: [DatePipe],

})
export class StudentMeasureComponent implements OnInit {
    student: Student;
    measures: Measure[] = [];
    viewDialog: boolean = false;
    selectedMeasure: Measure | null = null;

    editMode: boolean = false; // Determina si estamos en modo edición

    loading: boolean = true;
    studentId: number;
    submitted: boolean = false;
    measureDialog: boolean = false;

    newMeasure: Measure = {
        startDate: new Date(),
        height: 0,
        weight: 0,
        shoulder: 0,
        chest: 0,
        arm: 0,
        waist: 0,
        hip: 0,
        leg: 0,
    };

    lineData: any;
    radarData: any;
    lineOptions: any;
    radarOptions: any;

    constructor(
        private studentsService: StudentsService,
        private studentMeasureService: StudentMeasureService,
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

    editMeasure(measure: Measure): void {
        this.selectedMeasure = { ...measure }; // Clona la medida seleccionada
        this.editMode = true; // Activamos el modo de edición
        this.measureDialog = true; // Mostramos el diálogo
    }


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
            this.studentMeasureService.getMeasures(studentId).subscribe({
                next: (data) => {
                    this.measures = data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
                    this.loading = false;
                    this.initCharts();
                },
                error: (error) => {
                    console.error('Error al cargar medidas:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudieron cargar las medidas del estudiante.',
                        confirmButtonText: 'Aceptar',
                    });
                }
            });

        }
    }

    viewMeasure(measure: Measure): void {
        this.selectedMeasure = { ...measure }; // Clonar la medida seleccionada
        this.viewDialog = true;
    }

    closeViewDialog(): void {
        this.viewDialog = false;
        this.selectedMeasure = null;
    }

    refresh(): void {
        let path = `/students/measure/${this.student.id}`;
        console.log(path)
        this.router.navigate([path]);
    }

    getBMIStatusClass(bmi: number): string {
        if (bmi < 18.5) return 'BAJO_PESO';
        if (bmi < 25) return 'NORMAL';
        if (bmi < 30) return 'SOBREPESO';
        return 'OBESIDAD';
    }

    bmiStatuses = [
        { label: 'Bajo_Peso', value: 'BAJO_PESO' },
        { label: 'Normal', value: 'NORMAL' },
        { label: 'Sobrepeso', value: 'SOBREPESO' },
        { label: 'Obesidad', value: 'OBESIDAD' }
    ];

    confirmDelete(id: number): void {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará la medida de manera permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        }).then((result) => {
            if (result.isConfirmed) {
                this.studentMeasureService.deleteMeasure(+this.student.id, id).subscribe({
                    next: () => {
                        Swal.fire('¡Eliminado!', 'La medida ha sido eliminada correctamente.', 'success');
                        this.measures = this.measures.filter((measure) => measure.id !== id);
                        console.log("refresco")
                        this.sortMeasuresByDate();

                    },
                    error: (error) => {
                        console.error('Error al eliminar medida:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No se pudo eliminar la medida.',
                            confirmButtonText: 'Aceptar',
                        });
                    },
                });
            }
        });
    }

    addMeasure(): void {
        this.router.navigate([`/students/${this.student.id}/measure/new`]);
    }

    openNew(): void {
        this.selectedMeasure = {
            startDate: new Date(),
            height: 170,
            weight: 70,
            shoulder: 54,
            chest: 99,
            arm: 37,
            waist: 89,
            hip: 104,
            leg: 69,
        };
        this.editMode = false; // Asegúrate de que no está en modo edición
        this.submitted = false;
        this.measureDialog = true; // Abre el diálogo
    }


    hideDialog(): void {
        this.measureDialog = false;
        this.submitted = false;
    }

    saveMeasure(): void {
        this.submitted = true;

        // Validar campos obligatorios
        if (
            !this.selectedMeasure.startDate ||
            !this.selectedMeasure.height ||
            !this.selectedMeasure.weight ||
            !this.selectedMeasure.shoulder ||
            !this.selectedMeasure.chest ||
            !this.selectedMeasure.arm ||
            !this.selectedMeasure.waist ||
            !this.selectedMeasure.hip ||
            !this.selectedMeasure.leg
        ) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor complete todos los campos obligatorios.',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        if (this.editMode) {
            // Modo edición
            this.studentMeasureService.updateMeasure(+this.student.id, this.selectedMeasure.id!, this.selectedMeasure).subscribe({
                next: (updatedMeasure) => {
                    this.hideDialog();
                    Swal.fire('¡Éxito!', 'La medida fue actualizada correctamente.', 'success');
                    this.measures = this.measures.map((measure) =>
                        measure.id === updatedMeasure.id ? updatedMeasure : measure
                    );
                    this.sortMeasuresByDate();
                },
                error: (error) => {
                    console.error('Error al actualizar medida:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un problema al actualizar la medida. Intente nuevamente.',
                        confirmButtonText: 'Aceptar',
                    });
                },
            });
        } else {
            // Modo agregar
            this.studentMeasureService.postMeasure(+this.student.id, this.selectedMeasure).subscribe({
                next: (savedMeasure) => {
                    Swal.fire('¡Éxito!', 'La medida fue agregada correctamente.', 'success');
                    this.measures.push(savedMeasure);
                    this.hideDialog();
                    this.sortMeasuresByDate();
                },
                error: (error) => {
                    console.error('Error al guardar medida:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un problema al guardar la medida. Intente nuevamente.',
                        confirmButtonText: 'Aceptar',
                    });
                },
            });
        }
    }

    sortMeasuresByDate(): void {
        this.measures.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }

    loadMeasures(): void {
        this.studentMeasureService.getMeasures(+this.student.id).subscribe({
            next: (data) => {
                this.measures = data;
                this.sortMeasuresByDate(); // Ordenar las medidas al cargarlas
            },
            error: (error) => {
                console.error('Error al cargar medidas:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar las medidas. Intente nuevamente.',
                    confirmButtonText: 'Aceptar',
                });
            },
        });
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Obtener el año actual
        const currentYear = new Date().getFullYear();

        // Inicializar array para el peso de cada mes
        const monthlyWeights: (number | null)[] = Array(12).fill(null);

        // Filtrar las medidas para el año actual y ordenarlas por fecha
        const measuresThisYear = this.measures
            .filter((measure) => new Date(measure.startDate).getFullYear() === currentYear)
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        let lastWeight: number | null = null;

        // Rellenar `monthlyWeights` con las reglas mencionadas
        for (let month = 0; month < 12; month++) {
            const monthMeasures = measuresThisYear.filter((measure) => new Date(measure.startDate).getMonth() === month);

            if (monthMeasures.length > 0) {
                lastWeight = monthMeasures[monthMeasures.length - 1].weight; // Último peso del mes
                monthlyWeights[month] = lastWeight;
            } else {
                monthlyWeights[month] = lastWeight; // Usar el peso del mes anterior si no hay
            }
        }

        // Rellenar con null para los meses posteriores al último mes con medida
        const lastMeasuredMonth = measuresThisYear.length > 0
            ? new Date(measuresThisYear[measuresThisYear.length - 1].startDate).getMonth()
            : -1;

        for (let month = lastMeasuredMonth + 1; month < 12; month++) {
            monthlyWeights[month] = null;
        }

        // Configurar datos del gráfico de líneas
        this.lineData = {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [
                {
                    label: 'Peso Mensual (Kg)',
                    data: monthlyWeights,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    tension: 0.4
                }
            ]
        };

        this.lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
            }
        };

        this.initRadarChart();
    }

    initRadarChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');

        if (this.measures.length === 0) {
            return; // Evitar errores si no hay medidas
        }

        // Ordenar las medidas por fecha
        const sortedMeasures = [...this.measures].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        // Primera y última medida
        const firstMeasure = sortedMeasures[0];
        console.log(firstMeasure)
        const lastMeasure = sortedMeasures[sortedMeasures.length - 1];
        console.log(lastMeasure)
        // Configurar datos del gráfico de radar
        this.radarData = {
            labels: ['Hombro', 'Pecho', 'Brazo', 'Pierna', 'Cintura', 'Cadera', 'Peso'],
            datasets: [
                {
                    label: 'Primera medida',
                    data: [
                        firstMeasure.shoulder,
                        firstMeasure.chest,
                        firstMeasure.arm,
                        firstMeasure.leg,
                        firstMeasure.waist,
                        firstMeasure.hip,
                        firstMeasure.weight
                    ],
                    borderColor: documentStyle.getPropertyValue('--indigo-400'),
                    pointBackgroundColor: documentStyle.getPropertyValue('--indigo-400'),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    pointBorderColor: documentStyle.getPropertyValue('--indigo-400'),
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--indigo-400'),
                },
                {
                    label: 'Última medida',
                    data: [
                        lastMeasure.shoulder,
                        lastMeasure.chest,
                        lastMeasure.arm,
                        lastMeasure.leg,
                        lastMeasure.waist,
                        lastMeasure.hip,
                        lastMeasure.weight
                    ],
                    borderColor: documentStyle.getPropertyValue('--purple-400'),
                    pointBackgroundColor: documentStyle.getPropertyValue('--purple-400'),
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    pointBorderColor: documentStyle.getPropertyValue('--purple-400'),
                    pointHoverBackgroundColor: textColor,
                    pointHoverBorderColor: documentStyle.getPropertyValue('--purple-400'),
                }
            ]
        };

        this.radarOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                r: {
                    grid: {
                        color: textColorSecondary
                    },
                    ticks: {
                        color: textColor
                    }
                }
            }
        };
    }


}
