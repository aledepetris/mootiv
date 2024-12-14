import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MuscleComponent } from './muscle/muscle.component';

const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MuscleComponent },
        { path: '**', redirectTo: '' }
    ])],
    exports: [RouterModule]
})
export class MusclesRoutingModule { }
