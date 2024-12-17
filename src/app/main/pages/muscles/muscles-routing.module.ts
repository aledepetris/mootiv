import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MuscleComponent } from './muscle/muscle.component';
import { MuscleListComponent } from './muscle-list/muscle-list.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MuscleListComponent },
        { path: 'new', component: MuscleComponent },
        { path: ':id', component: MuscleComponent },
        { path: '**', redirectTo: '' }
    ])],
    exports: [RouterModule]
})
export class MusclesRoutingModule { }
