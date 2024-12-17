import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseListComponent } from './exercises-list/exercises-list.component';
import { ExerciseComponent } from './exercise/exercise.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ExerciseListComponent },
        { path: 'new', component: ExerciseComponent },
        { path: ':id', component: ExerciseComponent },
        { path: '**', redirectTo: '' }
    ])],
    exports: [RouterModule]
})
export class ExerciseRoutingModule { }
