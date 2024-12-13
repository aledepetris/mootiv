import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseTypeListComponent } from './exercise-types-list/exercise-types-list.component';
import { ExerciseTypeComponent } from './exercise-type/exercise-types.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ExerciseTypeListComponent },
        { path: 'new', component: ExerciseTypeComponent },
        { path: ':id', component: ExerciseTypeComponent },
        { path: '**', redirectTo: '' }
    ])],
    exports: [RouterModule]
})
export class ExerciseTypesRoutingModule { }
