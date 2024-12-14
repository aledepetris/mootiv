import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentComponent } from './student/student.component';
import { StudentViewComponent } from './student-dashboard/student-view.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: StudentListComponent },
        { path: 'new', component: StudentComponent },
        { path: ':id', component: StudentComponent },
        { path: 'view/:id', component: StudentViewComponent },
        { path: '**', redirectTo: '' }
    ])],
    exports: [RouterModule]
})
export class StudentsRoutingModule { }
