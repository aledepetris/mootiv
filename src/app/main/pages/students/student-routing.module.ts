import { StudentPlanComponent } from './student-plan/student-plan.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentComponent } from './student/student.component';
import { StudentViewComponent } from './student-dashboard/student-view.component';
import { StudentConditionComponent } from './student-condition/student-condition.component';
import { StudentPlaceComponent } from './student-places/student-place.component';
import { StudentMeasureComponent } from './student-measures/student-measures.component';
import { StudentPlaceFormComponent } from './student-place-form/student-place-form.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: StudentListComponent },
        { path: 'new', component: StudentComponent },
        { path: ':id', component: StudentComponent },
        { path: 'view/:id', component: StudentViewComponent },
        { path: 'condition/:id', component: StudentConditionComponent },
        { path: 'location/:id', component: StudentPlaceComponent },
        { path: 'location/:idS/form/:idP', component: StudentPlaceFormComponent },
        { path: 'location/:idS/form', component: StudentPlaceFormComponent },
        { path: 'measure/:id', component: StudentMeasureComponent },
        { path: 'plan/:id', component: StudentPlanComponent },

        { path: '**', redirectTo: '' }
    ])],
    exports: [RouterModule]
})
export class StudentsRoutingModule { }
