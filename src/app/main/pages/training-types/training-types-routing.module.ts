import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingTypeListComponent } from './training-types-list/training-types-list.component';
import { TrainingTypeComponent } from './training-type/training-types.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TrainingTypeListComponent },
        { path: 'new', component: TrainingTypeComponent },
        { path: ':id', component: TrainingTypeComponent },
        { path: '**', redirectTo: '' }
    ])],
    exports: [RouterModule]
})
export class TrainingTypesRoutingModule { }
